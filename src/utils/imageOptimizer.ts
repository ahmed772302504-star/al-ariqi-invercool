/**
 * Image compressor & optimizer utility for client-side image optimization.
 * Compresses images before uploading to ensure fast performance and low bandwidth,
 * with resilient fallbacks that guarantee the image is never rejected.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Safely converts a File or Blob into a Base64 data URL using FileReader
 */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => {
      reject(reader.error || new Error('FileReader error occurred'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses and optimizes an image file or Base64 string.
 * Always resolves gracefully with a valid data URL — never throws fatal exceptions.
 */
export async function compressImage(
  fileOrBase64: File | string,
  options: CompressionOptions = {}
): Promise<{ dataUrl: string; sizeBytes: number; originalSizeBytes?: number }> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    format = 'image/webp'
  } = options;

  let rawDataUrl = '';
  let originalSizeBytes: number | undefined;

  try {
    if (typeof fileOrBase64 === 'string') {
      rawDataUrl = fileOrBase64;
      originalSizeBytes = Math.round((fileOrBase64.length * 3) / 4);
    } else {
      originalSizeBytes = fileOrBase64.size;
      // Use FileReader which works reliably across all browser iframes and CSP configurations
      rawDataUrl = await fileToDataUrl(fileOrBase64);
    }
  } catch {
    // If FileReader failed or input is corrupted, return safe fallback if string
    if (typeof fileOrBase64 === 'string') {
      return {
        dataUrl: fileOrBase64,
        sizeBytes: Math.round((fileOrBase64.length * 3) / 4),
        originalSizeBytes
      };
    }
    throw new Error('فشل في قراءة ملف الصورة من جهازك');
  }

  // 1. Vector graphics (SVG) should NOT be rasterized onto canvas
  const isSvg =
    rawDataUrl.startsWith('data:image/svg+xml') ||
    (typeof fileOrBase64 !== 'string' &&
      (fileOrBase64.type === 'image/svg+xml' || fileOrBase64.name?.toLowerCase().endsWith('.svg')));

  if (isSvg) {
    const approxSize = Math.round((rawDataUrl.length * 3) / 4);
    return {
      dataUrl: rawDataUrl,
      sizeBytes: approxSize,
      originalSizeBytes: originalSizeBytes || approxSize
    };
  }

  // 2. Animated GIFs: keep original to preserve animation frames
  const isGif =
    rawDataUrl.startsWith('data:image/gif') ||
    (typeof fileOrBase64 !== 'string' && fileOrBase64.type === 'image/gif');

  if (isGif) {
    const approxSize = Math.round((rawDataUrl.length * 3) / 4);
    return {
      dataUrl: rawDataUrl,
      sizeBytes: approxSize,
      originalSizeBytes: originalSizeBytes || approxSize
    };
  }

  // 3. Attempt HTML5 Canvas compression
  try {
    const compressed = await new Promise<{ dataUrl: string; sizeBytes: number }>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      // Safety timeout: don't hang indefinitely if image decoding stalls
      const timeoutId = setTimeout(() => {
        cleanup();
        // Resolve with original dataUrl instead of rejecting
        resolve({ dataUrl: rawDataUrl, sizeBytes: Math.round((rawDataUrl.length * 3) / 4) });
      }, 7000);

      const cleanup = () => {
        clearTimeout(timeoutId);
        img.onload = null;
        img.onerror = null;
      };

      img.onload = () => {
        cleanup();
        try {
          let { width, height } = img;
          if (!width || !height) {
            resolve({ dataUrl: rawDataUrl, sizeBytes: Math.round((rawDataUrl.length * 3) / 4) });
            return;
          }

          // Calculate aspect ratio scale
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve({ dataUrl: rawDataUrl, sizeBytes: Math.round((rawDataUrl.length * 3) / 4) });
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // White background for transparent images converting to JPEG
          if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          let outputFormat = format;
          let outputDataUrl = canvas.toDataURL(outputFormat, quality);

          // Fallback to JPEG if browser doesn't support WebP export
          if (format === 'image/webp' && !outputDataUrl.startsWith('data:image/webp')) {
            outputFormat = 'image/jpeg';
            outputDataUrl = canvas.toDataURL(outputFormat, quality);
          }

          const approxSize = Math.round((outputDataUrl.length * 3) / 4);

          // If compression resulted in a larger size than the original, keep original
          if (originalSizeBytes && approxSize >= originalSizeBytes) {
            resolve({ dataUrl: rawDataUrl, sizeBytes: originalSizeBytes });
          } else {
            resolve({ dataUrl: outputDataUrl, sizeBytes: approxSize });
          }
        } catch {
          // On canvas error (e.g. memory or security), fallback to original data URL
          resolve({ dataUrl: rawDataUrl, sizeBytes: Math.round((rawDataUrl.length * 3) / 4) });
        }
      };

      img.onerror = () => {
        cleanup();
        // If image loading fails, resolve with raw data URL rather than rejecting!
        resolve({ dataUrl: rawDataUrl, sizeBytes: Math.round((rawDataUrl.length * 3) / 4) });
      };

      // Set src AFTER event listeners are attached
      img.src = rawDataUrl;

      // Handle synchronous completion if already loaded
      if (img.complete && img.naturalWidth > 0) {
        img.onload?.(new Event('load'));
      }
    });

    return {
      dataUrl: compressed.dataUrl,
      sizeBytes: compressed.sizeBytes,
      originalSizeBytes: originalSizeBytes || compressed.sizeBytes
    };
  } catch {
    // Ultimate fallback: return raw dataUrl without error
    const approxSize = Math.round((rawDataUrl.length * 3) / 4);
    return {
      dataUrl: rawDataUrl,
      sizeBytes: approxSize,
      originalSizeBytes: originalSizeBytes || approxSize
    };
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

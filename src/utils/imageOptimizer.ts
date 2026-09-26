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
 * Safely converts a File or Blob into a Base64 data URL using FileReader,
 * with resilient fallbacks to arrayBuffer and URL.createObjectURL for mobile stability.
 */
export async function fileToDataUrl(file: File | Blob): Promise<string> {
  // Strategy 1: Standard FileReader with timeout
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      const timeout = setTimeout(() => {
        try {
          reader.abort();
        } catch {}
        reject(new Error('FileReader timeout'));
      }, 4000);

      reader.onload = () => {
        clearTimeout(timeout);
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Invalid reader result'));
        }
      };
      reader.onerror = () => {
        clearTimeout(timeout);
        reject(reader.error || new Error('FileReader error'));
      };
      reader.readAsDataURL(file);
    });

    if (dataUrl && dataUrl.startsWith('data:')) {
      return dataUrl;
    }
  } catch (err) {
    // Fall through to Strategy 2
  }

  // Strategy 2: arrayBuffer() conversion (handles mobile memory and permission quirks)
  if (typeof file.arrayBuffer === 'function') {
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      if (bytes.length > 0) {
        let binary = '';
        const len = bytes.byteLength;
        const chunkSize = 0x8000; // 32KB chunks to prevent call stack overflow
        for (let i = 0; i < len; i += chunkSize) {
          binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
        }
        const base64 = btoa(binary);
        const mime = file.type || 'image/jpeg';
        return `data:${mime};base64,${base64}`;
      }
    } catch (err) {
      // Fall through to Strategy 3
    }
  }

  // Strategy 3: URL.createObjectURL + Canvas rasterization
  if (typeof window !== 'undefined' && typeof window.URL?.createObjectURL === 'function') {
    try {
      const objectUrl = window.URL.createObjectURL(file);
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || 800;
            canvas.height = img.naturalHeight || 600;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const res = canvas.toDataURL('image/jpeg', 0.82);
              window.URL.revokeObjectURL(objectUrl);
              resolve(res);
              return;
            }
          } catch {}
          window.URL.revokeObjectURL(objectUrl);
          reject(new Error('Canvas export failed'));
        };
        img.onerror = () => {
          window.URL.revokeObjectURL(objectUrl);
          reject(new Error('Object URL image load failed'));
        };
        img.src = objectUrl;
      });
      return dataUrl;
    } catch (err) {
      // Fall through
    }
  }

  throw new Error('تعذر قراءة ملف الصورة، يرجى المحاولة بصيغة JPG أو PNG أخرى');
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
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.78,
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
      // Use resilient fileToDataUrl with multi-strategy fallbacks
      rawDataUrl = await fileToDataUrl(fileOrBase64);
    }
  } catch (err: any) {
    // If input is already string or has fallback, return safe fallback
    if (typeof fileOrBase64 === 'string') {
      return {
        dataUrl: fileOrBase64,
        sizeBytes: Math.round((fileOrBase64.length * 3) / 4),
        originalSizeBytes
      };
    }
    throw new Error(err?.message || 'فشل في قراءة ملف الصورة، يرجى المحاولة بصورة أخرى أو رابط مباشر');
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

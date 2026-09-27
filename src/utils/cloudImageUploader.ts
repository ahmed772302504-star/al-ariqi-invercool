/**
 * Cloud Image Uploader using ImgBB API & Client-side Canvas Compression
 * 1. Automatically scales down and compresses images to max 1200px (quality 0.8)
 * 2. Uploads directly to ImgBB via FormData
 * 3. Logs detailed error status and messages to console
 * 4. Gracefully falls back to backend /api/upload or compressed DataURL to prevent blocking errors
 */

const IMGBB_PRIMARY_KEY = '6d207e02198a847aa98d0a2a901485a5';

export interface UploadResult {
  url: string;
  deleteUrl?: string;
  width?: number;
  height?: number;
}

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Compresses an image client-side using an HTML5 Canvas:
 * - Resizes image so width and height do not exceed 1200px
 * - Re-encodes with 0.8 quality (WEBP or JPEG)
 * - Returns both compressed Blob and DataURL
 */
export async function compressImage(
  fileOrBlob: File | Blob,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<CompressionResult> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      blob: fileOrBlob,
      dataUrl: '',
      width: 0,
      height: 0
    };
  }

  // Pass through SVG files without canvas rasterization
  if (fileOrBlob instanceof File && fileOrBlob.type === 'image/svg+xml') {
    const textDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) || '');
      reader.readAsDataURL(fileOrBlob);
    });
    return {
      blob: fileOrBlob,
      dataUrl: textDataUrl,
      width: 1200,
      height: 1200
    };
  }

  return new Promise((resolve) => {
    let objectUrl = '';
    try {
      objectUrl = URL.createObjectURL(fileOrBlob);
    } catch {
      // Ignored
    }

    const fallbackReader = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          blob: fileOrBlob,
          dataUrl: (reader.result as string) || '',
          width: 800,
          height: 600
        });
      };
      reader.onerror = () => {
        resolve({
          blob: fileOrBlob,
          dataUrl: '',
          width: 0,
          height: 0
        });
      };
      reader.readAsDataURL(fileOrBlob);
    };

    const img = new Image();

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width <= 0 || height <= 0) {
        fallbackReader();
        return;
      }

      // Scale dimensions maintaining aspect ratio
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
        fallbackReader();
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Determine best format: prefer image/webp, fallback to image/jpeg
      let mimeType = 'image/jpeg';
      let dataUrl = '';
      try {
        const webpTest = canvas.toDataURL('image/webp', quality);
        if (webpTest.startsWith('data:image/webp')) {
          mimeType = 'image/webp';
          dataUrl = webpTest;
        } else {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
      } catch {
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, dataUrl, width, height });
          } else {
            try {
              const byteString = atob(dataUrl.split(',')[1]);
              const ab = new ArrayBuffer(byteString.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
              }
              const createdBlob = new Blob([ab], { type: mimeType });
              resolve({ blob: createdBlob, dataUrl, width, height });
            } catch {
              resolve({ blob: fileOrBlob, dataUrl, width, height });
            }
          }
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      fallbackReader();
    };

    if (objectUrl) {
      img.src = objectUrl;
    } else {
      fallbackReader();
    }
  });
}

/**
 * Uploads a file (or Blob) directly to ImgBB with:
 * 1. Automatic client-side canvas compression (<= 1200px, 0.8 quality)
 * 2. ImgBB direct API upload with precise error logging (status & message)
 * 3. Fallback to /api/upload (disk storage)
 * 4. Safe fallback to compressed DataURL to prevent blocking user workflows
 */
export async function uploadToImgBB(
  file: File | Blob,
  customName?: string
): Promise<UploadResult> {
  // 1. Client-side automatic compression
  let compressedBlob: Blob = file;
  let compressedDataUrl = '';
  let imgWidth = 0;
  let imgHeight = 0;

  try {
    const comp = await compressImage(file, 1200, 1200, 0.8);
    compressedBlob = comp.blob;
    compressedDataUrl = comp.dataUrl;
    imgWidth = comp.width;
    imgHeight = comp.height;
  } catch (compErr) {
    console.warn('Image compression bypassed, using original file:', compErr);
  }

  // 2. Prepare ImgBB Keys (Primary + any environment key)
  const envKey = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_IMGBB_API_KEY;
  const IMGBB_KEYS = [
    IMGBB_PRIMARY_KEY,
    ...(envKey && envKey !== IMGBB_PRIMARY_KEY ? [envKey] : [])
  ];

  // Try ImgBB upload
  for (const apiKey of IMGBB_KEYS) {
    try {
      const formData = new FormData();
      const rawBaseName = customName || (file instanceof File ? file.name : 'upload');
      const safeFilename = rawBaseName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_') + '.jpg';
      formData.append('image', compressedBlob, safeFilename);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;
      let rawText = '';

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        rawText = await res.text();
        try {
          data = JSON.parse(rawText);
        } catch {
          data = { error: { message: rawText } };
        }
      }

      if (res.ok && data?.success && (data?.data?.url || data?.data?.display_url)) {
        const directUrl = data.data.url || data.data.display_url;
        return {
          url: directUrl,
          deleteUrl: data.data?.delete_url,
          width: data.data?.width || imgWidth,
          height: data.data?.height || imgHeight
        };
      } else {
        // Detailed error logging as requested
        console.error(
          `[ImgBB Upload Error] Status: ${res.status} (${res.statusText})`,
          {
            status: res.status,
            statusText: res.statusText,
            errorMessage: data?.error?.message || data?.error || 'Unknown ImgBB error',
            errorCode: data?.error?.code,
            rawResponse: rawText || data
          }
        );
      }
    } catch (networkErr) {
      console.error('[ImgBB Network Error] Could not connect to ImgBB:', networkErr);
    }
  }

  // 3. Fallback: Local /api/upload endpoint (saves permanently to /uploads/)
  try {
    const backendForm = new FormData();
    backendForm.append('file', compressedBlob);
    if (customName) backendForm.append('filename', customName);

    const backendRes = await fetch('/api/upload', {
      method: 'POST',
      body: backendForm
    });

    if (backendRes.ok) {
      const resJson = await backendRes.json();
      if (resJson?.url) {
        return {
          url: resJson.url,
          width: imgWidth,
          height: imgHeight
        };
      }
    } else {
      console.warn('[Backend Upload] Returned non-OK status:', backendRes.status);
    }
  } catch (backendErr) {
    console.warn('[Backend Upload Fallback Failed]:', backendErr);
  }

  // 4. Safe fallback: Return the lightweight compressed DataURL (Base64)
  // Guarantees zero blocking errors for the user
  if (compressedDataUrl && compressedDataUrl.startsWith('data:image/')) {
    console.info('ImgBB cloud unavailable: safely using compressed local DataURL.');
    return {
      url: compressedDataUrl,
      width: imgWidth,
      height: imgHeight
    };
  }

  // Final fallback if dataUrl wasn't generated
  return new Promise<UploadResult>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve({
          url: reader.result as string,
          width: imgWidth,
          height: imgHeight
        });
      } else {
        reject(new Error('فشل في معالجة ملف الصورة.'));
      }
    };
    reader.onerror = () => reject(new Error('فشل في قراءة ملف الصورة.'));
    reader.readAsDataURL(file);
  });
}

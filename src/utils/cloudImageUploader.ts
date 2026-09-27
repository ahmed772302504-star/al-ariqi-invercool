/**
 * Cloud Image Uploader using ImgBB API
 * Uploads images directly as FormData to ImgBB and returns a permanent HTTPS URL.
 */

const IMGBB_API_KEY = '6d207e02198a847aa98d0a2a901485a5';
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

export interface UploadResult {
  url: string;
  deleteUrl?: string;
  width?: number;
  height?: number;
}

/**
 * Uploads a file (or Blob) directly to ImgBB via FormData.
 * 1. Appends file to FormData with name 'image' only
 * 2. Sends POST without any custom headers (allows browser to set multipart/form-data boundary)
 * 3. Extracts permanent URL from data.data.url or data.data.display_url
 * 4. Logs explicit error details to console.error on failure
 * 5. Falls back safely to preserve application stability
 */
export async function uploadToImgBB(
  file: File | Blob,
  customName?: string
): Promise<UploadResult> {
  // 1. Direct ImgBB Cloud Upload
  try {
    const formData = new FormData();
    formData.append('image', file);

    // Send request via POST with NO headers
    const res = await fetch(IMGBB_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (res.ok && data?.success && (data?.data?.url || data?.data?.display_url)) {
      const directUrl = data.data.url || data.data.display_url;
      return {
        url: directUrl,
        deleteUrl: data.data?.delete_url,
        width: data.data?.width,
        height: data.data?.height
      };
    } else {
      // Print explicit error from ImgBB
      console.error(
        'ImgBB Upload Error:',
        data?.error?.message || data?.error || data || res.statusText
      );
    }
  } catch (err) {
    console.error('ImgBB Network/Fetch Error:', err);
  }

  // 2. Safe Fallback Path: Backend /api/upload
  try {
    const backendForm = new FormData();
    backendForm.append('file', file);
    if (customName) {
      backendForm.append('filename', customName);
    }

    const backendRes = await fetch('/api/upload', {
      method: 'POST',
      body: backendForm
    });

    if (backendRes.ok) {
      const resJson = await backendRes.json();
      if (resJson?.url) {
        return { url: resJson.url };
      }
    } else {
      console.error('Backend upload returned non-OK status:', backendRes.status);
    }
  } catch (fallbackErr) {
    console.error('Backend upload fallback failed:', fallbackErr);
  }

  // 3. Graceful final error fallback
  throw new Error('تعذر رفع الصورة إلى سحابة ImgBB. يرجى التحقق من اتصال الإنترنت أو تجربة صورة أخرى.');
}

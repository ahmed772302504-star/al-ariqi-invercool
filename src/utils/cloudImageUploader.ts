/**
 * Cloud Image Uploader using ImgBB API
 * Uploads images directly as FormData to ImgBB and returns a permanent HTTPS URL.
 * Never stores Base64 / Data URLs in data files.
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
 * If ImgBB fails (e.g. temporary API quota or network), falls back gracefully to backend /api/upload.
 */
export async function uploadToImgBB(file: File | Blob, customName?: string): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('image', file);
  if (customName) {
    formData.append('name', customName);
  }

  // 1. Primary path: Direct ImgBB Cloud Upload
  try {
    const response = await fetch(IMGBB_UPLOAD_URL, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.data?.url) {
        return {
          url: data.data.url,
          deleteUrl: data.data.delete_url,
          width: data.data.width,
          height: data.data.height
        };
      }
    } else {
      console.warn('ImgBB API returned non-OK status:', response.status);
    }
  } catch (err) {
    console.warn('Direct ImgBB upload network issue, trying fallback:', err);
  }

  // 2. Fallback path: Upload to backend /api/upload (which serves static /uploads/ permanently)
  try {
    const backendForm = new FormData();
    backendForm.append('file', file);
    if (customName) backendForm.append('filename', customName);

    const backendRes = await fetch('/api/upload', {
      method: 'POST',
      body: backendForm
    });

    if (backendRes.ok) {
      const resJson = await backendRes.json();
      if (resJson && resJson.url) {
        return { url: resJson.url };
      }
    }
  } catch (fallbackErr) {
    console.error('Backend upload fallback failed:', fallbackErr);
  }

  throw new Error('تعذر رفع الصورة إلى السحابة (ImgBB). يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.');
}

/**
 * Image Cache-Buster and URL Resolver Utility
 * Solves browser HTTP caching issues by appending timestamp/version query parameters.
 * Supports data: URIs, blob: URIs, relative assets, and absolute HTTP(S) URLs safely.
 */

export function getCacheBustedUrl(
  url?: string | null,
  version?: string | number | null,
  fallback = '/logo-icon.png'
): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const trimmed = url.trim();

  // Data URLs (base64) and Blob URLs are self-contained and should NOT have query params appended
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Determine cache-busting version parameter
  const v = version != null ? String(version) : String(Date.now());

  try {
    // If the URL already has a v= or t= query param, replace it with the new version
    if (/[?&](?:v|t|ts)=\d+/.test(trimmed)) {
      return trimmed.replace(/([?&](?:v|t|ts)=)\d+/, `$1${v}`);
    }

    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}v=${v}`;
  } catch {
    return trimmed;
  }
}

/**
 * Generates a unique React key for an image to force DOM re-render & repaint
 */
export function getImageReactKey(prefix: string, url?: string | null, version?: string | number | null): string {
  const v = version != null ? String(version) : '';
  const urlSnippet = url ? (url.startsWith('data:') ? `data-${url.length}` : url.slice(-20)) : 'none';
  return `${prefix}-${urlSnippet}-${v}`;
}

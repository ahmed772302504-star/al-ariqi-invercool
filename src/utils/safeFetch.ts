/**
 * Safe Fetch JSON Helper
 * Protects against HTML error pages (e.g. 404/500 on Vercel/Netlify)
 * throwing "Unexpected token < or T, "The page c"... is not valid JSON".
 */
export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit,
  fallbackValue: T | null = null
): Promise<T | null> {
  try {
    const res = await fetch(input, init);
    if (!res.ok) {
      return fallbackValue;
    }

    const contentType = res.headers.get('content-type') || '';
    // If response is HTML or plain text not JSON, return fallback
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      try {
        return JSON.parse(text) as T;
      } catch {
        return fallbackValue;
      }
    }

    const text = await res.text();
    if (!text || !text.trim()) {
      return fallbackValue;
    }

    // Protection against HTML string start
    const trimmed = text.trim();
    if (trimmed.startsWith('<') || trimmed.startsWith('The page') || trimmed.startsWith('Not Found')) {
      return fallbackValue;
    }

    return JSON.parse(trimmed) as T;
  } catch (err) {
    return fallbackValue;
  }
}

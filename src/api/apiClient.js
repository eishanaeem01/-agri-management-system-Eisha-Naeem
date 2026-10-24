// Common fetch wrapper: timeout + consistent, readable errors.
export const request = async (url, { timeout = 12000, ...options } = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('The request timed out. Check your connection and retry.');
    if (err instanceof TypeError) throw new Error('Network error. Check your internet connection and retry.');
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

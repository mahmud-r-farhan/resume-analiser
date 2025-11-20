export async function parseJSONSafe(response) {
  const status = response.status;
  const ok = response.ok;
  const text = await response.text();
  if (!text) {
    return { ok, status, data: {} };
  }
  try {
    const data = JSON.parse(text);
    return { ok, status, data };
  } catch (e) {
    // non-JSON fallback (plain text / HTML from upstream)
    return { ok, status, data: { __rawText: text, error: text } };
  }
}

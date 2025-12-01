const API_BASE = import.meta.env.VITE_API_ENDPOINT;

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

export async function fetchUserProfile(token) {
  try {
    const res = await fetch(`${API_BASE}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const parsed = await parseJSONSafe(res);
    if (parsed.ok) {
      return { ok: true, user: parsed.data.user };
    }
    return { ok: false, error: parsed.data.error || 'Failed to fetch profile' };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export async function fetchProfileStats(token) {
  try {
    const res = await fetch(`${API_BASE}/profile/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const parsed = await parseJSONSafe(res);
    if (parsed.ok) {
      return { ok: true, stats: parsed.data.stats };
    }
    return { ok: false, error: parsed.data.error || 'Failed to fetch stats' };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export async function fetchUserQuota(token) {
  try {
    const res = await fetch(`${API_BASE}/auth/quota`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const parsed = await parseJSONSafe(res);
    if (parsed.ok) {
      return { ok: true, quota: parsed.data.quota };
    }
    return { ok: false, error: parsed.data.error || 'Failed to fetch quota' };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export async function updateUserProfile(token, updates) {
  try {
    const res = await fetch(`${API_BASE}/profile/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const parsed = await parseJSONSafe(res);
    if (parsed.ok) {
      return { ok: true, user: parsed.data.user };
    }
    return { ok: false, error: parsed.data.error || 'Failed to update profile' };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

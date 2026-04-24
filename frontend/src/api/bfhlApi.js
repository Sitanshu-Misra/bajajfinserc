const API_BASE = import.meta.env.VITE_API_URL || '';

export async function postBfhl(data) {
  const res = await fetch(`${API_BASE}/bfhl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }

  return res.json();
}

const BASE = import.meta.env.VITE_API_BASE_URL || '/api/notes';

function withTimeout(signal, ms = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(new DOMException('Request timed out', 'TimeoutError')), ms);
  signal?.addEventListener('abort', () => controller.abort());
  controller.signal.addEventListener('abort', () => clearTimeout(id));
  return controller.signal;
}

async function request(url, options = {}) {
  const signal = withTimeout(options.signal);
  const headers = { ...options.headers };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, { ...options, headers, signal });
  const json = await res.json();
  if (!res.ok) {
    const msg = json.errors
      ? json.errors.map((e) => `${e.field}: ${e.message}`).join(', ')
      : json.message;
    throw new Error(msg || 'Request failed');
  }
  return json;
}

export async function fetchNotes({ search, tags, signal, token } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (tags && tags.length > 0) params.set('tags', tags.join(','));
  const qs = params.toString();
  const json = await request(qs ? `${BASE}?${qs}` : BASE, { token, signal });
  return json.data;
}

export async function createNote(data, { signal, token } = {}) {
  const json = await request(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    token,
    signal,
  });
  return json.data;
}

export async function updateNote(id, data, { signal, token } = {}) {
  const json = await request(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    token,
    signal,
  });
  return json.data;
}

export async function deleteNote(id, { signal, token } = {}) {
  return request(`${BASE}/${id}`, { method: 'DELETE', token, signal });
}

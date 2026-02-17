const API_BASE = 'https://invigorating-enchantment-production-3ebd.up.railway.app';


function getToken() {
  return localStorage.getItem('motocare_token');
}

export function setAuth(token) {
  if (token) localStorage.setItem('motocare_token', token);
  else localStorage.removeItem('motocare_token');
}

export function getAuthUser() {
  const raw = localStorage.getItem('motocare_user');
  return raw ? JSON.parse(raw) : null;
}

export function setAuthUser(user) {
  if (user) localStorage.setItem('motocare_user', JSON.stringify(user));
  else localStorage.removeItem('motocare_user');
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export async function apiGet(path) {
  return request(path, { method: 'GET' });
}

export async function apiPost(path, body) {
  return request(path, { method: 'POST', body: JSON.stringify(body) });
}

export async function apiPut(path, body) {
  return request(path, { method: 'PUT', body: JSON.stringify(body) });
}

export async function apiDelete(path) {
  return request(path, { method: 'DELETE' });
}

export async function apiUpload(path, formData) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

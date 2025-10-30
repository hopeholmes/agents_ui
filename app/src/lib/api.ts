/** Lightweight fetch helpers for the Agents API */
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');


if (!BASE_URL) {
// eslint-disable-next-line no-console
console.warn('[api] VITE_API_BASE_URL is not set. Requests will fail.');
}


export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';


export async function api<T>(path: string, init?: RequestInit): Promise<T> {
const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
const res = await fetch(url, {
headers: {
'Content-Type': 'application/json',
...(init?.headers || {}),
},
...init,
});


if (!res.ok) {
const text = await res.text().catch(() => '');
throw new Error(`API ${res.status} ${res.statusText}: ${text || url}`);
}


// Some endpoints may return empty/no JSON (e.g., 204)
const ctype = res.headers.get('content-type') || '';
if (!ctype.includes('application/json')) return undefined as unknown as T;
return (await res.json()) as T;
}


export async function get<T>(path: string): Promise<T> {
return api<T>(path, { method: 'GET' });
}


export async function post<T>(path: string, body?: unknown): Promise<T> {
return api<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}


export async function ping(): Promise<{ status: 'ok' } | undefined> {
try {
return await get<{ status: 'ok' }>('/health');
} catch (e) {
return undefined;
}
}

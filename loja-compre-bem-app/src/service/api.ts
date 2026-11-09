export const SERVIDOR_URL = "http://localhost:8080";
const API_URL = `${SERVIDOR_URL}/api/v1`;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: options?.body ? { 'Content-Type': 'application/json' } : undefined,
  });
  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' });
}

export async function post<T>(endpoint: string, body: any): Promise<T> {
  return request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
}

export async function put<T>(endpoint: string, body: any): Promise<T> {
  return request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
}

export async function del(endpoint: string): Promise<void> {
  return request<void>(endpoint, { method: 'DELETE' });
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: isFormData
      ? (options.headers || {})
      : {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (!response.ok) {
    throw new Error(data?.detail || data?.error || 'Request failed')
  }

  return data
}

export const api = {
  health: () => request('/health/'),
  generateImage: (payload) => request('/images/', {
    method: 'POST',
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
  }),
  generateVideo: (payload) => request('/videos/', {
    method: 'POST',
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
  }),
  publish: (payload) => request('/publish/', { method: 'POST', body: JSON.stringify(payload) }),
  listJobs: () => request('/jobs/'),
  stats: () => request('/stats/'),
}

export default api

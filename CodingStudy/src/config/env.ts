const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const env = {
  apiBaseUrl: apiBaseUrl || 'http://localhost:3000/api',
}

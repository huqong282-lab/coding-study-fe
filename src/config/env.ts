const defaultBaseUrl = 'https://coding-study-be-ten.vercel.app'

function normalizeBaseUrl(value?: string) {
  if (!value) {
    return defaultBaseUrl
  }

  return value.replace(/\/api\/?$/, '').replace(/\/+$/, '') || defaultBaseUrl
}

export const env = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL?.trim()),
}

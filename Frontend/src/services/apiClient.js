import { getToken, clearAuth } from '../utils/tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function parseResponse(response) {
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }
  return data
}

function getErrorMessage(data, fallback) {
  return data?.message || data?.error || fallback
}

// For login/signup — NO token
export async function publicFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(data, 'Request failed'))
  }

  return data
}

// For protected APIs — WITH token
export async function authFetch(path, options = {}) {
  const token = getToken()

  if (!token) {
    throw new Error('Not authenticated. Please log in again.')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  const data = await parseResponse(response)

  if (response.status === 401) {
    clearAuth()
    throw new Error(getErrorMessage(data, 'Session expired. Please log in again.'))
  }
  
  if (response.status === 403) {
    throw new Error(getErrorMessage(data, 'You are not allowed to perform this action'))
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(data, 'Request failed'))
  }

  return data
}
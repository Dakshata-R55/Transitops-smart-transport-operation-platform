import { publicFetch } from './apiClient'

export async function signup(userData) {
  return publicFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function login(email, password) {
  return publicFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
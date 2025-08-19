// src/services/api.js
import axios from 'axios'
import { config } from '../config/app'

const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ✅ Har request se pehle token add karo
api.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

// Helpers
export const apiGet = async (url, params = {}) => {
  const res = await api.get(url, { params })
  return res.data
}

export const apiPost = async (url, data = {}) => {
  const res = await api.post(url, data)
  return res.data
}

export const apiPut = async (url, data = {}) => {
  const res = await api.put(url, data)
  return res.data
}

export const apiDelete = async (url) => {
  const res = await api.delete(url)
  return res.data
}

export default api

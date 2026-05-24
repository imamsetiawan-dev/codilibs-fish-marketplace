const BASE_URL = 'https://codilibs-fish-marketplace-production.up.railway.app'

// Products
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${BASE_URL}/api/products?${query}`)
  return res.json()
}

export const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`)
  return res.json()
}

export const createProduct = async (data) => {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const updateProduct = async (id, data) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
  })
  return res.json()
}

// Orders
export const createOrder = async (data) => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const getOrders = async () => {
  const res = await fetch(`${BASE_URL}/api/orders`)
  return res.json()
}

export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/api/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  return res.json()
}

// Auth
export const register = async (data) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}
// Upload gambar
export const uploadImages = async (files) => {
  const formData = new FormData()
  files.forEach(file => formData.append('images', file))

  const res = await fetch(`${BASE_URL}/api/upload/multiple`, {
    method: 'POST',
    body: formData,
  })
  return res.json()
}

export const uploadSingleImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`${BASE_URL}/api/upload/single`, {
    method: 'POST',
    body: formData,
  })
  return res.json()
}
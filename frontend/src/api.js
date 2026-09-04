const BASE = import.meta.env.VITE_API_URL || '/api'

export const getToken = () => localStorage.getItem('admin_token')
export const setToken = (token) => {
  if (token) localStorage.setItem('admin_token', token)
  else localStorage.removeItem('admin_token')
}

function authHeaders(extra = {}) {
  const token = getToken()
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function fetchJSON(url, { headers, ...rest } = {}) {
  const res = await fetch(BASE + url, {
    headers: authHeaders({ 'Content-Type': 'application/json', ...headers }),
    ...rest,
  })
  const data = await res.json()
  if (!res.ok) {
    if (res.status === 401) setToken(null)
    throw { status: res.status, ...data }
  }
  return data
}

async function fetchForm(url, formData) {
  const res = await fetch(BASE + url, {
    method: 'POST',
    body: formData,
    headers: authHeaders(),
  })
  const data = await res.json()
  if (!res.ok) {
    if (res.status === 401) setToken(null)
    throw { status: res.status, ...data }
  }
  return data
}

// === PUBLIC ===
export const getHome = () => fetchJSON('/home')
export const getInformasi = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return fetchJSON(`/informasi${q ? '?' + q : ''}`)
}
export const getInfoDetail = (id) => fetchJSON(`/info/${id}`)
export const getPortofolio = () => fetchJSON('/portofolio')
export const getPortofolioDetail = (id) => fetchJSON(`/portofolio/${id}`)
export const getTentang = () => fetchJSON('/tentang')

// === VIEWS ===
export const incrementView = (page = 'tentang') => fetchJSON('/views', {
  method: 'POST',
  body: JSON.stringify({ page }),
})
export const getViewCount = (page = 'tentang') => fetchJSON(`/views?page=${page}`)

// === AUTH ===
export const authCheck = () => fetchJSON('/auth/check')
export const authLogin = async (username, password) => {
  const data = await fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
  if (data?.data?.token) setToken(data.data.token)
  return data
}
export const authLogout = async () => {
  const data = await fetchJSON('/auth/logout')
  setToken(null)
  return data
}

// === ADMIN: INFO ===
export const adminInfoList = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return fetchJSON(`/admin/informasi${q ? '?' + q : ''}`)
}
export const adminInfoSave = (formData) => fetchForm('/admin/informasi/store', formData)
export const adminInfoUpdate = (id, formData) => fetchForm(`/admin/informasi/update/${id}`, formData)
export const adminInfoDelete = (id) => fetchJSON(`/admin/informasi/delete/${id}`, { method: 'POST' })

// === ADMIN: PORTFOLIO ===
export const adminPortfolioList = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return fetchJSON(`/admin/portofolio${q ? '?' + q : ''}`)
}
export const adminPortfolioSave = (formData) => fetchForm('/admin/portofolio/store', formData)
export const adminPortfolioUpdate = (id, formData) => fetchForm(`/admin/portofolio/update/${id}`, formData)
export const adminPortfolioDelete = (id) => fetchJSON(`/admin/portofolio/delete/${id}`, { method: 'POST' })

// === ADMIN: REPOSITORY ===
export const adminRepoList = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return fetchJSON(`/admin/repository${q ? '?' + q : ''}`)
}
export const adminRepoSave = (formData) => fetchForm('/admin/repository/store', formData)
export const adminRepoUpdate = (id, formData) => fetchForm(`/admin/repository/update/${id}`, formData)
export const adminRepoDelete = (id) => fetchJSON(`/admin/repository/delete/${id}`, { method: 'POST' })
export const adminRepoImport = (jsonData) => fetchJSON('/admin/repository/import', {
  method: 'POST',
  body: JSON.stringify({ json_data: jsonData }),
})

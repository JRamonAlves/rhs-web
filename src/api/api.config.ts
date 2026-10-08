export const API_URL = (
  import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8080"
).replace(/\/+$/, "")

function getStorageUrl() {
  return new URL(`${API_URL}/getValues`)
}

function setStorageUrl() {
  return new URL(`${API_URL}/setValues`)
}

export const storageRouting = {
  getStorageUrl,
  setStorageUrl,
}

function getServicesUrl() {
  return new URL(`${API_URL}/getServices`)
}

function getServiceCountsUrl() {
  return new URL(`${API_URL}/countServices`)
}

export const servicesRouting = {
  getServiceCountsUrl,
  getServicesUrl,
}

function getPageInfoUrl() {
  return new URL(`${API_URL}/getPageInfo`)
}

export const pageRouting = {
  getPageInfoUrl,
}

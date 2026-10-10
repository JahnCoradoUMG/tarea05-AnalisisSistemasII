/**
 * Acceso genérico a localStorage con JSON.
 * Las pantallas NO deben usar este módulo directamente.
 *
 * Roadmap (fase 8): esta capa puede reemplazarse por fetch('/api/...')
 * manteniendo la misma firma getJSON/setJSON o repos dedicados por entidad.
 * Ver README → sección «Roadmap».
 */

export function getJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null || raw === undefined) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeKey(key) {
  localStorage.removeItem(key)
}

import { STORAGE_KEYS } from '../utils/constants'
import { getJSON, setJSON } from './storage'

// future: fetch('/api/ventas') — intercambiar localStorage por API sin tocar la UI.

export function getAllVentas() {
  return getJSON(STORAGE_KEYS.ventas, [])
}

export function saveAllVentas(ventas) {
  setJSON(STORAGE_KEYS.ventas, ventas)
}

export function getVentaById(id) {
  return getAllVentas().find((v) => v.id === id) ?? null
}

export function insertVenta(venta) {
  const list = getAllVentas()
  list.push(venta)
  saveAllVentas(list)
  return venta
}

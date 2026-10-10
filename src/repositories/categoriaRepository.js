import { STORAGE_KEYS } from '../utils/constants'
import { getJSON, setJSON } from './storage'

export function getAllCategorias() {
  return getJSON(STORAGE_KEYS.categorias, [])
}

export function saveAllCategorias(categorias) {
  setJSON(STORAGE_KEYS.categorias, categorias)
}

export function getCategoriaById(id) {
  return getAllCategorias().find((c) => c.id === id) ?? null
}

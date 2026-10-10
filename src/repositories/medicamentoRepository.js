import { STORAGE_KEYS } from '../utils/constants'
import { getJSON, setJSON } from './storage'

export function getAllMedicamentos() {
  return getJSON(STORAGE_KEYS.medicamentos, [])
}

export function saveAllMedicamentos(medicamentos) {
  setJSON(STORAGE_KEYS.medicamentos, medicamentos)
}

export function getMedicamentoById(id) {
  return getAllMedicamentos().find((m) => m.id === id) ?? null
}

export function insertMedicamento(medicamento) {
  const list = getAllMedicamentos()
  list.push(medicamento)
  saveAllMedicamentos(list)
  return medicamento
}

export function updateMedicamento(id, data) {
  const list = getAllMedicamentos()
  const index = list.findIndex((m) => m.id === id)
  if (index === -1) return null
  list[index] = { ...list[index], ...data, id }
  saveAllMedicamentos(list)
  return list[index]
}

export function deleteMedicamento(id) {
  const list = getAllMedicamentos()
  const next = list.filter((m) => m.id !== id)
  if (next.length === list.length) return false
  saveAllMedicamentos(next)
  return true
}

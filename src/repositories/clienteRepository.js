import { STORAGE_KEYS } from '../utils/constants'
import { getJSON, setJSON } from './storage'

export function getAllClientes() {
  return getJSON(STORAGE_KEYS.clientes, [])
}

export function saveAllClientes(clientes) {
  setJSON(STORAGE_KEYS.clientes, clientes)
}

export function getClienteById(id) {
  return getAllClientes().find((c) => c.id === id) ?? null
}

export function insertCliente(cliente) {
  const list = getAllClientes()
  list.push(cliente)
  saveAllClientes(list)
  return cliente
}

export function updateCliente(id, data) {
  const list = getAllClientes()
  const index = list.findIndex((c) => c.id === id)
  if (index === -1) return null
  list[index] = { ...list[index], ...data, id }
  saveAllClientes(list)
  return list[index]
}

export function deleteCliente(id) {
  const list = getAllClientes()
  const next = list.filter((c) => c.id !== id)
  if (next.length === list.length) return false
  saveAllClientes(next)
  return true
}

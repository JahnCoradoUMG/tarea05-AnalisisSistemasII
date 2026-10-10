import * as clienteRepository from '../repositories/clienteRepository'
import { generateId } from '../utils/ids'

export function listarClientes() {
  return clienteRepository.getAllClientes()
}

export function validarCliente(data) {
  const errors = []
  if (!data.nombre || !String(data.nombre).trim()) {
    errors.push('El nombre es obligatorio.')
  }
  const telefono = String(data.telefono ?? '').trim()
  const documento = String(data.documento ?? '').trim()
  if (!telefono && !documento) {
    errors.push('Debe indicar al menos teléfono o documento (DPI/NIT).')
  }
  return errors
}

function normalizePayload(data) {
  return {
    nombre: String(data.nombre).trim(),
    telefono: String(data.telefono ?? '').trim(),
    documento: String(data.documento ?? '').trim(),
  }
}

export function crearCliente(data) {
  const errors = validarCliente(data)
  if (errors.length) {
    return { ok: false, errors }
  }
  const cliente = {
    id: generateId('cli'),
    ...normalizePayload(data),
  }
  clienteRepository.insertCliente(cliente)
  return { ok: true, data: cliente }
}

export function actualizarCliente(id, data) {
  const errors = validarCliente(data)
  if (errors.length) {
    return { ok: false, errors }
  }
  const updated = clienteRepository.updateCliente(id, normalizePayload(data))
  if (!updated) {
    return { ok: false, errors: ['Cliente no encontrado.'] }
  }
  return { ok: true, data: updated }
}

/**
 * Elimina el cliente. No borra ventas asociadas (conservan clienteId / snapshot).
 */
export function eliminarCliente(id) {
  const ok = clienteRepository.deleteCliente(id)
  return { ok, errors: ok ? [] : ['Cliente no encontrado.'] }
}

import * as categoriaRepository from '../repositories/categoriaRepository'
import * as medicamentoRepository from '../repositories/medicamentoRepository'
import { STOCK_BAJO_UMBRAL } from '../utils/constants'
import { generateId } from '../utils/ids'
import { isSoonToExpire, isStockBajo } from '../utils/dates'

function enrich(medicamento) {
  const categoria = categoriaRepository.getCategoriaById(medicamento.categoriaId)
  const umbral = medicamento.umbralStockBajo ?? STOCK_BAJO_UMBRAL
  return {
    ...medicamento,
    categoriaNombre: categoria?.nombre ?? 'Sin categoría',
    esStockBajo: isStockBajo(medicamento.stock, umbral),
    esProximoVencer: isSoonToExpire(medicamento.fechaVencimiento),
  }
}

export function listarMedicamentos() {
  return medicamentoRepository.getAllMedicamentos().map(enrich)
}

export function listarCategorias() {
  return categoriaRepository.getAllCategorias()
}

export function buscarMedicamentos({ nombre = '', categoriaId = '' } = {}) {
  const term = nombre.trim().toLowerCase()
  return listarMedicamentos().filter((m) => {
    const matchNombre = !term || m.nombre.toLowerCase().includes(term)
    const matchCat = !categoriaId || m.categoriaId === categoriaId
    return matchNombre && matchCat
  })
}

export function validarMedicamento(data) {
  const errors = []
  if (!data.nombre || !String(data.nombre).trim()) {
    errors.push('El nombre es obligatorio.')
  }
  if (data.stock === '' || data.stock === null || data.stock === undefined) {
    errors.push('El stock es obligatorio.')
  } else if (Number.isNaN(Number(data.stock)) || Number(data.stock) < 0) {
    errors.push('El stock debe ser un número mayor o igual a 0.')
  }
  if (data.precioVenta === '' || data.precioVenta === null || data.precioVenta === undefined) {
    errors.push('El precio de venta es obligatorio.')
  } else if (Number.isNaN(Number(data.precioVenta)) || Number(data.precioVenta) <= 0) {
    errors.push('El precio de venta debe ser mayor que 0.')
  }
  if (!data.fechaVencimiento) {
    errors.push('La fecha de vencimiento es obligatoria.')
  }
  if (!data.categoriaId) {
    errors.push('Debe seleccionar una categoría.')
  }
  return errors
}

function normalizePayload(data) {
  return {
    nombre: String(data.nombre).trim(),
    categoriaId: data.categoriaId,
    presentacion: String(data.presentacion ?? '').trim(),
    stock: Number(data.stock),
    precioVenta: Number(data.precioVenta),
    lote: String(data.lote ?? '').trim(),
    fechaVencimiento: data.fechaVencimiento,
  }
}

export function crearMedicamento(data) {
  const errors = validarMedicamento(data)
  if (errors.length) {
    return { ok: false, errors }
  }
  const medicamento = {
    id: generateId('med'),
    ...normalizePayload(data),
  }
  medicamentoRepository.insertMedicamento(medicamento)
  return { ok: true, data: enrich(medicamento) }
}

export function actualizarMedicamento(id, data) {
  const errors = validarMedicamento(data)
  if (errors.length) {
    return { ok: false, errors }
  }
  const updated = medicamentoRepository.updateMedicamento(id, normalizePayload(data))
  if (!updated) {
    return { ok: false, errors: ['Medicamento no encontrado.'] }
  }
  return { ok: true, data: enrich(updated) }
}

export function eliminarMedicamento(id) {
  const ok = medicamentoRepository.deleteMedicamento(id)
  return { ok, errors: ok ? [] : ['Medicamento no encontrado.'] }
}

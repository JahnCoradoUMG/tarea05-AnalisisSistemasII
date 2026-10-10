import * as clienteRepository from '../repositories/clienteRepository'
import * as medicamentoRepository from '../repositories/medicamentoRepository'
import * as ventaRepository from '../repositories/ventaRepository'
import { generateId } from '../utils/ids'

/**
 * Lista ventas enriquecidas con nombre de cliente (si aplica),
 * más recientes primero.
 */
export function listarVentas() {
  const clientes = clienteRepository.getAllClientes()
  const byId = Object.fromEntries(clientes.map((c) => [c.id, c]))

  return ventaRepository
    .getAllVentas()
    .map((v) => {
      const cliente = v.clienteId ? byId[v.clienteId] : null
      return {
        ...v,
        clienteNombre: cliente?.nombre ?? (v.clienteId ? 'Cliente eliminado' : null),
        itemsResumen: (v.items ?? [])
          .map((it) => `${it.nombreMedicamento} ×${it.cantidad}`)
          .join(', '),
      }
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}

/**
 * Valida y registra una venta multi-ítem.
 * RF-06, RF-07, RF-10: valida stock ANTES de escribir; si falla, no muta.
 *
 * @param {{ items: Array<{ medicamentoId: string, cantidad: number|string }>, clienteId?: string|null }} payload
 */
export function crearVenta(payload) {
  const errors = []
  const rawItems = Array.isArray(payload?.items) ? payload.items : []

  if (rawItems.length === 0) {
    return { ok: false, errors: ['Agregue al menos un medicamento a la venta.'] }
  }

  const normalizedLines = []
  for (let i = 0; i < rawItems.length; i++) {
    const line = rawItems[i]
    const n = i + 1
    if (!line?.medicamentoId) {
      errors.push(`Línea ${n}: debe seleccionar un medicamento.`)
      continue
    }
    const cantidad = Number(line.cantidad)
    if (!Number.isFinite(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)) {
      errors.push(`Línea ${n}: la cantidad debe ser un entero mayor que 0.`)
      continue
    }
    normalizedLines.push({ medicamentoId: line.medicamentoId, cantidad })
  }

  if (errors.length) {
    return { ok: false, errors }
  }

  // Agregar cantidades por medicamento (varias líneas del mismo producto).
  const demanded = new Map()
  for (const line of normalizedLines) {
    demanded.set(
      line.medicamentoId,
      (demanded.get(line.medicamentoId) ?? 0) + line.cantidad,
    )
  }

  const medCache = new Map()
  for (const [medicamentoId, totalQty] of demanded) {
    const med = medicamentoRepository.getMedicamentoById(medicamentoId)
    if (!med) {
      errors.push(`Medicamento no encontrado (${medicamentoId}).`)
      continue
    }
    medCache.set(medicamentoId, med)
    if (Number(med.stock) < totalQty) {
      errors.push(
        `Stock insuficiente de «${med.nombre}»: solicitado ${totalQty}, disponible ${med.stock}.`,
      )
    }
  }

  let clienteId = payload?.clienteId || null
  if (clienteId) {
    const cliente = clienteRepository.getClienteById(clienteId)
    if (!cliente) {
      return { ok: false, errors: ['El cliente seleccionado no existe.'] }
    }
  } else {
    clienteId = null
  }

  if (errors.length) {
    return { ok: false, errors }
  }

  // Construir ítems con precio snapshot y subtotales (RF-06).
  const items = normalizedLines.map((line) => {
    const med = medCache.get(line.medicamentoId)
    const precioUnitario = Number(med.precioVenta)
    const subtotal = Math.round(precioUnitario * line.cantidad * 100) / 100
    return {
      medicamentoId: line.medicamentoId,
      nombreMedicamento: med.nombre,
      cantidad: line.cantidad,
      precioUnitario,
      subtotal,
    }
  })

  const total =
    Math.round(items.reduce((sum, it) => sum + it.subtotal, 0) * 100) / 100

  const venta = {
    id: generateId('ven'),
    fecha: new Date().toISOString(),
    clienteId,
    total,
    items,
  }

  // Persistencia atómica lógica: validación ya pasó; escribir venta + stocks.
  ventaRepository.insertVenta(venta)
  for (const [medicamentoId, totalQty] of demanded) {
    const med = medCache.get(medicamentoId)
    medicamentoRepository.updateMedicamento(medicamentoId, {
      stock: Number(med.stock) - totalQty,
    })
  }

  return { ok: true, data: venta }
}

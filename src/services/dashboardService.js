import * as medicamentoRepository from '../repositories/medicamentoRepository'
import * as ventaRepository from '../repositories/ventaRepository'
import { STOCK_BAJO_UMBRAL } from '../utils/constants'
import { isSoonToExpire, isStockBajo, isToday } from '../utils/dates'

/**
 * Resumen operativo del día (RF-01), coherente con RF-05 vía mismos utils.
 */
export function getResumen() {
  const ventas = ventaRepository.getAllVentas()
  const ventasHoy = ventas.filter((v) => isToday(v.fecha))
  const montoVentasHoy =
    Math.round(
      ventasHoy.reduce((sum, v) => sum + Number(v.total || 0), 0) * 100,
    ) / 100

  const medicamentos = medicamentoRepository.getAllMedicamentos()

  const stockBajo = medicamentos
    .filter((m) =>
      isStockBajo(m.stock, m.umbralStockBajo ?? STOCK_BAJO_UMBRAL),
    )
    .map((m) => ({
      id: m.id,
      nombre: m.nombre,
      stock: m.stock,
      umbral: m.umbralStockBajo ?? STOCK_BAJO_UMBRAL,
    }))
    .sort((a, b) => a.stock - b.stock)

  const proximosVencer = medicamentos
    .filter((m) => isSoonToExpire(m.fechaVencimiento))
    .map((m) => ({
      id: m.id,
      nombre: m.nombre,
      fechaVencimiento: m.fechaVencimiento,
      stock: m.stock,
    }))
    .sort((a, b) =>
      String(a.fechaVencimiento).localeCompare(String(b.fechaVencimiento)),
    )

  return {
    ventasHoy: {
      conteo: ventasHoy.length,
      monto: montoVentasHoy,
    },
    stockBajo,
    proximosVencer,
  }
}

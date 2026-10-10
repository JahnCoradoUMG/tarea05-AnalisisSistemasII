import { DIAS_PROXIMO_VENCER, STOCK_BAJO_UMBRAL } from './constants'

/**
 * Parsea YYYY-MM-DD (o Date / ISO con hora) como fecha local a medianoche.
 * Evita el desfase UTC de `new Date('YYYY-MM-DD')`.
 */
export function parseLocalDate(value) {
  if (!value) return null
  if (value instanceof Date) {
    const d = new Date(value)
    d.setHours(0, 0, 0, 0)
    return d
  }
  const raw = String(value)
  const dateOnly = raw.slice(0, 10)
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOnly)
  if (match) {
    const [, y, m, day] = match
    return new Date(Number(y), Number(m) - 1, Number(day))
  }
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return null
  d.setHours(0, 0, 0, 0)
  return d
}

/** Devuelve YYYY-MM-DD en zona local. */
export function toISODate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Suma o resta días a una fecha (ISO o Date). */
export function addDays(date, days) {
  const d = date instanceof Date ? new Date(date) : parseLocalDate(date) ?? new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/** True si la fecha cae en el día calendario actual (local). */
export function isToday(isoDateOrDateTime) {
  if (!isoDateOrDateTime) return false
  const d = new Date(isoDateOrDateTime)
  if (Number.isNaN(d.getTime())) return false
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

/**
 * True si vence dentro de los próximos `dias` días (incluye hoy).
 * Considera próximo a vencer: fecha entre hoy y hoy+dias (calendario local).
 */
export function isSoonToExpire(fechaVencimiento, dias = DIAS_PROXIMO_VENCER) {
  if (!fechaVencimiento) return false
  const venc = parseLocalDate(fechaVencimiento)
  if (!venc) return false
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const limite = addDays(hoy, dias)
  return venc >= hoy && venc <= limite
}


export function isStockBajo(stock, umbral = STOCK_BAJO_UMBRAL) {
  return Number(stock) <= Number(umbral)
}

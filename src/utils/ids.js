/** Genera un identificador único simple para el cliente. */
export function generateId(prefix = 'id') {
  const random = Math.random().toString(36).slice(2, 9)
  return `${prefix}_${Date.now()}_${random}`
}

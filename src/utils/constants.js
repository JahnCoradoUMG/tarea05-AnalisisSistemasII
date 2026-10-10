/** Umbral de stock bajo (SRS RF-01, RF-05). */
export const STOCK_BAJO_UMBRAL = 5

/** Días para considerar un medicamento próximo a vencer. */
export const DIAS_PROXIMO_VENCER = 30

/** Prefijo de claves en localStorage (RF-11). */
export const STORAGE_PREFIX = 'farmacia_'

export const STORAGE_KEYS = {
  initialized: `${STORAGE_PREFIX}initialized`,
  categorias: `${STORAGE_PREFIX}categorias`,
  medicamentos: `${STORAGE_PREFIX}medicamentos`,
  clientes: `${STORAGE_PREFIX}clientes`,
  ventas: `${STORAGE_PREFIX}ventas`,
}

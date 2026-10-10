import {
  seedCategorias,
  seedMedicamentos,
  seedClientes,
  seedVentas,
} from '../data/seeds'
import { STORAGE_KEYS } from '../utils/constants'
import { getJSON, removeKey, setJSON } from './storage'
import { saveAllCategorias } from './categoriaRepository'
import { saveAllMedicamentos } from './medicamentoRepository'
import { saveAllClientes } from './clienteRepository'
import { saveAllVentas } from './ventaRepository'

function seedAll() {
  saveAllCategorias(structuredClone(seedCategorias))
  saveAllMedicamentos(structuredClone(seedMedicamentos))
  saveAllClientes(structuredClone(seedClientes))
  saveAllVentas(structuredClone(seedVentas))
  setJSON(STORAGE_KEYS.initialized, true)
}

/**
 * RF-11: carga seeds la primera vez que no existe el flag de inicialización.
 */
export function bootstrap() {
  const already = getJSON(STORAGE_KEYS.initialized, false)
  if (already) return { seeded: false }

  seedAll()
  return { seeded: true }
}

/**
 * Limpia claves del MVP y vuelve a cargar seeds (útil para la demo).
 */
export function resetDatosDemo() {
  Object.values(STORAGE_KEYS).forEach((key) => removeKey(key))
  seedAll()
  return { reset: true }
}


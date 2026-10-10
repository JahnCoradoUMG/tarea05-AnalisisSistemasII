import { addDays, toISODate } from '../utils/dates'

const hoy = new Date()

/**
 * Datos semilla para la primera carga (RF-11).
 * Incluye mezcla de stock normal, stock bajo y próximo a vencer.
 */
export const seedCategorias = [
  { id: 'cat_analgesicos', nombre: 'Analgésicos' },
  { id: 'cat_antibioticos', nombre: 'Antibióticos' },
  { id: 'cat_vitaminas', nombre: 'Vitaminas' },
  { id: 'cat_gastro', nombre: 'Gastrointestinales' },
  { id: 'cat_respiratorio', nombre: 'Respiratorio' },
]

export const seedMedicamentos = [
  {
    id: 'med_001',
    nombre: 'Paracetamol 500 mg',
    categoriaId: 'cat_analgesicos',
    presentacion: 'Tabletas',
    stock: 48,
    precioVenta: 2.5,
    lote: 'L-PARA-2026',
    fechaVencimiento: toISODate(addDays(hoy, 180)),
  },
  {
    id: 'med_002',
    nombre: 'Ibuprofeno 400 mg',
    categoriaId: 'cat_analgesicos',
    presentacion: 'Tabletas',
    stock: 3,
    precioVenta: 3.25,
    lote: 'L-IBU-2025',
    fechaVencimiento: toISODate(addDays(hoy, 120)),
  },
  {
    id: 'med_003',
    nombre: 'Amoxicilina 500 mg',
    categoriaId: 'cat_antibioticos',
    presentacion: 'Cápsulas',
    stock: 25,
    precioVenta: 8.75,
    lote: 'L-AMOX-2026',
    fechaVencimiento: toISODate(addDays(hoy, 20)),
  },
  {
    id: 'med_004',
    nombre: 'Azitromicina 500 mg',
    categoriaId: 'cat_antibioticos',
    presentacion: 'Tabletas',
    stock: 12,
    precioVenta: 15.0,
    lote: 'L-AZIT-2026',
    fechaVencimiento: toISODate(addDays(hoy, 90)),
  },
  {
    id: 'med_005',
    nombre: 'Vitamina C 1000 mg',
    categoriaId: 'cat_vitaminas',
    presentacion: 'Tabletas efervescentes',
    stock: 60,
    precioVenta: 6.5,
    lote: 'L-VITC-2027',
    fechaVencimiento: toISODate(addDays(hoy, 365)),
  },
  {
    id: 'med_006',
    nombre: 'Complejo B',
    categoriaId: 'cat_vitaminas',
    presentacion: 'Tabletas',
    stock: 4,
    precioVenta: 9.9,
    lote: 'L-CB-2025',
    fechaVencimiento: toISODate(addDays(hoy, 15)),
  },
  {
    id: 'med_007',
    nombre: 'Omeprazol 20 mg',
    categoriaId: 'cat_gastro',
    presentacion: 'Cápsulas',
    stock: 35,
    precioVenta: 5.5,
    lote: 'L-OME-2026',
    fechaVencimiento: toISODate(addDays(hoy, 200)),
  },
  {
    id: 'med_008',
    nombre: 'Loratadina 10 mg',
    categoriaId: 'cat_respiratorio',
    presentacion: 'Tabletas',
    stock: 2,
    precioVenta: 4.0,
    lote: 'L-LORA-2025',
    fechaVencimiento: toISODate(addDays(hoy, 10)),
  },
  {
    id: 'med_009',
    nombre: 'Jarabe para la tos',
    categoriaId: 'cat_respiratorio',
    presentacion: 'Jarabe 120 ml',
    stock: 18,
    precioVenta: 22.0,
    lote: 'L-TOS-2026',
    fechaVencimiento: toISODate(addDays(hoy, 250)),
  },
]

export const seedClientes = [
  {
    id: 'cli_001',
    nombre: 'María López',
    telefono: '5522-3344',
    documento: '2456789010101',
  },
  {
    id: 'cli_002',
    nombre: 'Carlos Méndez',
    telefono: '7788-9900',
    documento: '',
  },
  {
    id: 'cli_003',
    nombre: 'Ana Ruiz',
    telefono: '',
    documento: 'CF-998877-6',
  },
]

export const seedVentas = [
  {
    id: 'ven_001',
    fecha: new Date().toISOString(),
    clienteId: 'cli_001',
    total: 12.5,
    items: [
      {
        medicamentoId: 'med_001',
        nombreMedicamento: 'Paracetamol 500 mg',
        cantidad: 5,
        precioUnitario: 2.5,
        subtotal: 12.5,
      },
    ],
  },
  {
    id: 'ven_002',
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    clienteId: null,
    total: 17.5,
    items: [
      {
        medicamentoId: 'med_004',
        nombreMedicamento: 'Azitromicina 500 mg',
        cantidad: 1,
        precioUnitario: 15.0,
        subtotal: 15.0,
      },
      {
        medicamentoId: 'med_001',
        nombreMedicamento: 'Paracetamol 500 mg',
        cantidad: 1,
        precioUnitario: 2.5,
        subtotal: 2.5,
      },
    ],
  },
]

# Sistema de Farmacia (MVP)

SPA en React + Vite para inventario, clientes, ventas de mostrador y dashboard operativo de una farmacia de barrio. Persistencia en `localStorage` con datos semilla (RF-11).

Curso: Análisis de Sistemas II — UMG Retalhuleu — Tarea 05.

**Estado MVP:** **listo para demo** — implementado y **APROBADO MVP** por QA ([qa-fases-5-8.md](../Documentacion/qa-fases-5-8.md)); checklist §6 cerrado. Sin backend ni Docker en esta entrega.

## Requisitos

- Node.js 18+ recomendado
- npm

## Instalación y ejecución

```bash
cd farmacia-app
npm install
npm run dev
```

Abrir la URL que muestre Vite (por defecto `http://localhost:5173`).

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualizar el build |
| `npm run lint` | Linter (oxlint) |

## Módulos

| Módulo | Estado | Detalle |
|--------|--------|---------|
| Persistencia / seeds | Listo | Repositorios, `bootstrap`, seeds |
| Navegación | Listo | Layout + React Router |
| Medicamentos CRUD | Listo | Búsqueda, filtro, badges stock bajo / por vencer |
| Clientes CRUD | Listo | Nombre + teléfono o documento |
| Ventas + stock | Listo | Multi-ítem, validación stock, descuento, historial, cliente opcional |
| Dashboard | Listo | Ventas del día, stock bajo, próximos a vencer |

## Arquitectura

```text
pages/ → services/ → repositories/ → localStorage (+ seeds)
```

La UI **no** escribe en `localStorage` directamente.

Servicios: `inventarioService`, `clientesService`, `ventasService`, `dashboardService`.

## Cómo probar el flujo demo

1. **Dashboard:** abrir `/` → ver conteo/monto de ventas del día y listas de alertas; opcional «Restablecer datos de demostración».
2. **Venta válida:** Ventas → agregar 1–2 ítems con cantidad ≤ stock → Confirmar → stock baja en Medicamentos y el ticket aparece en historial.
3. **Venta inválida:** pedir más unidades que el stock (p. ej. Ibuprofeno × 99) → mensaje de error y stock intacto.
4. **Cliente opcional:** en nueva venta elegir un cliente o dejar «Mostrador».
5. **Volver al Dashboard:** comprobar que ventas del día y alertas coinciden con el inventario.

## Restablecer datos de demostración

- En el **Dashboard**, botón «Restablecer datos de demostración» (confirma y recarga seeds), **o**
- Borrar el almacenamiento del sitio en DevTools → Application → Local Storage y recargar.

Claves: `farmacia_*`.

## Aprendizajes útiles

1. Separar **pages → services → repositories** evita acoplar la UI a `localStorage`.
2. Validar stock **antes** de escribir evita inconsistencias a mitad de una venta.
3. React Router organiza el shell; los hooks (`useState` / `useMemo`) refrescan listas tras mutaciones.
4. Utils compartidos (`isStockBajo`, `isSoonToExpire`) mantienen coherencia entre inventario y dashboard.
5. Seeds + botón de reset facilitan demos repetibles.

## Roadmap (no implementado en este MVP)

- **API REST** detrás de los repositorios (`fetch('/api/...')`) sin cambiar las páginas.
- **Docker** para servir el build estático o un futuro backend.
- Login, compras a proveedor, reportes PDF, etc. (fuera del alcance SRS §8).

---

*Sistema de Farmacia — React MVP — Tarea 05 UMG.*

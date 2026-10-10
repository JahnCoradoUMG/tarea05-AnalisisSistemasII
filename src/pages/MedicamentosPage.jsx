import { useMemo, useState } from 'react'
import * as inventarioService from '../services/inventarioService'

const emptyForm = {
  nombre: '',
  categoriaId: '',
  presentacion: '',
  stock: '',
  precioVenta: '',
  lote: '',
  fechaVencimiento: '',
}

export default function MedicamentosPage() {
  const [nombreFiltro, setNombreFiltro] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [tick, setTick] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState([])
  const [showForm, setShowForm] = useState(false)

  const categorias = useMemo(
    () => inventarioService.listarCategorias(),
    [tick],
  )

  const medicamentos = useMemo(
    () =>
      inventarioService.buscarMedicamentos({
        nombre: nombreFiltro,
        categoriaId: categoriaFiltro,
      }),
    [nombreFiltro, categoriaFiltro, tick],
  )

  function refresh() {
    setTick((t) => t + 1)
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setErrors([])
    setShowForm(true)
  }

  function openEdit(med) {
    setEditingId(med.id)
    setForm({
      nombre: med.nombre,
      categoriaId: med.categoriaId,
      presentacion: med.presentacion ?? '',
      stock: String(med.stock),
      precioVenta: String(med.precioVenta),
      lote: med.lote ?? '',
      fechaVencimiento: med.fechaVencimiento,
    })
    setErrors([])
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setErrors([])
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const result = editingId
      ? inventarioService.actualizarMedicamento(editingId, form)
      : inventarioService.crearMedicamento(form)

    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    closeForm()
    refresh()
  }

  function handleDelete(med) {
    const ok = window.confirm(
      `¿Eliminar el medicamento "${med.nombre}"? Esta acción no se puede deshacer.`,
    )
    if (!ok) return
    inventarioService.eliminarMedicamento(med.id)
    refresh()
  }

  return (
    <section className="page">
      <header className="page-header row-between">
        <div>
          <h1>Medicamentos</h1>
          <p className="page-lead">
            Inventario: alta, edición, búsqueda e indicadores de alerta.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          Nuevo medicamento
        </button>
      </header>

      <div className="toolbar">
        <label className="field grow">
          <span>Buscar por nombre</span>
          <input
            type="search"
            placeholder="Ej. paracetamol"
            value={nombreFiltro}
            onChange={(e) => setNombreFiltro(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Categoría</span>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {showForm && (
        <div className="panel form-panel">
          <h2>{editingId ? 'Editar medicamento' : 'Nuevo medicamento'}</h2>
          {errors.length > 0 && (
            <ul className="alert alert-error">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field">
              <span>Nombre *</span>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </label>
            <label className="field">
              <span>Categoría *</span>
              <select
                name="categoriaId"
                value={form.categoriaId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione…</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Presentación</span>
              <input
                name="presentacion"
                value={form.presentacion}
                onChange={handleChange}
                placeholder="Tabletas, jarabe…"
              />
            </label>
            <label className="field">
              <span>Stock *</span>
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </label>
            <label className="field">
              <span>Precio de venta (Q) *</span>
              <input
                name="precioVenta"
                type="number"
                min="0.01"
                step="0.01"
                value={form.precioVenta}
                onChange={handleChange}
                required
              />
            </label>
            <label className="field">
              <span>Lote</span>
              <input name="lote" value={form.lote} onChange={handleChange} />
            </label>
            <label className="field">
              <span>Fecha de vencimiento *</span>
              <input
                name="fechaVencimiento"
                type="date"
                value={form.fechaVencimiento}
                onChange={handleChange}
                required
              />
            </label>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Guardar cambios' : 'Crear'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeForm}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Lote</th>
              <th>Vencimiento</th>
              <th>Alertas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicamentos.length === 0 ? (
              <tr>
                <td colSpan={8} className="empty-cell">
                  No hay medicamentos que coincidan con el filtro.
                </td>
              </tr>
            ) : (
              medicamentos.map((m) => (
                <tr key={m.id}>
                  <td>
                    <strong>{m.nombre}</strong>
                    {m.presentacion ? (
                      <div className="muted small">{m.presentacion}</div>
                    ) : null}
                  </td>
                  <td>{m.categoriaNombre}</td>
                  <td>{m.stock}</td>
                  <td>Q {Number(m.precioVenta).toFixed(2)}</td>
                  <td>{m.lote || '—'}</td>
                  <td>{m.fechaVencimiento}</td>
                  <td className="badges">
                    {m.esStockBajo && (
                      <span className="badge badge-warn">Stock bajo</span>
                    )}
                    {m.esProximoVencer && (
                      <span className="badge badge-danger">Por vencer</span>
                    )}
                    {!m.esStockBajo && !m.esProximoVencer && (
                      <span className="muted small">—</span>
                    )}
                  </td>
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => openEdit(m)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(m)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

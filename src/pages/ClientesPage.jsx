import { useMemo, useState } from 'react'
import * as clientesService from '../services/clientesService'

const emptyForm = {
  nombre: '',
  telefono: '',
  documento: '',
}

export default function ClientesPage() {
  const [tick, setTick] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState([])
  const [showForm, setShowForm] = useState(false)

  const clientes = useMemo(() => clientesService.listarClientes(), [tick])

  function refresh() {
    setTick((t) => t + 1)
  }

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setErrors([])
    setShowForm(true)
  }

  function openEdit(cliente) {
    setEditingId(cliente.id)
    setForm({
      nombre: cliente.nombre,
      telefono: cliente.telefono ?? '',
      documento: cliente.documento ?? '',
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
      ? clientesService.actualizarCliente(editingId, form)
      : clientesService.crearCliente(form)

    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    closeForm()
    refresh()
  }

  function handleDelete(cliente) {
    const ok = window.confirm(
      `¿Eliminar al cliente "${cliente.nombre}"? Las ventas asociadas conservarán su referencia.`,
    )
    if (!ok) return
    clientesService.eliminarCliente(cliente.id)
    refresh()
  }

  return (
    <section className="page">
      <header className="page-header row-between">
        <div>
          <h1>Clientes</h1>
          <p className="page-lead">
            Catálogo de compradores frecuentes (nombre + teléfono o documento).
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          Nuevo cliente
        </button>
      </header>

      {showForm && (
        <div className="panel form-panel">
          <h2>{editingId ? 'Editar cliente' : 'Nuevo cliente'}</h2>
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
              <span>Teléfono</span>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Opcional si hay documento"
              />
            </label>
            <label className="field">
              <span>Documento (DPI / NIT)</span>
              <input
                name="documento"
                value={form.documento}
                onChange={handleChange}
                placeholder="Opcional si hay teléfono"
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
              <th>Teléfono</th>
              <th>Documento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-cell">
                  No hay clientes registrados.
                </td>
              </tr>
            ) : (
              clientes.map((c) => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.nombre}</strong>
                  </td>
                  <td>{c.telefono || '—'}</td>
                  <td>{c.documento || '—'}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => openEdit(c)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(c)}
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

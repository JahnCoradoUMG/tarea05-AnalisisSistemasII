import { Fragment, useMemo, useState } from 'react'
import * as clientesService from '../services/clientesService'
import * as inventarioService from '../services/inventarioService'
import * as ventasService from '../services/ventasService'

function emptyLine() {
  return { medicamentoId: '', cantidad: '1' }
}

function formatFecha(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('es-GT', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export default function VentasPage() {
  const [tick, setTick] = useState(0)
  const [lines, setLines] = useState([emptyLine()])
  const [clienteId, setClienteId] = useState('')
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const medicamentos = useMemo(
    () => inventarioService.listarMedicamentos(),
    [tick],
  )
  const clientes = useMemo(() => clientesService.listarClientes(), [tick])
  const ventas = useMemo(() => ventasService.listarVentas(), [tick])

  const medById = useMemo(
    () => Object.fromEntries(medicamentos.map((m) => [m.id, m])),
    [medicamentos],
  )

  const previewLines = lines.map((line) => {
    const med = line.medicamentoId ? medById[line.medicamentoId] : null
    const cantidad = Number(line.cantidad)
    const qtyOk = Number.isFinite(cantidad) && cantidad > 0
    const precio = med ? Number(med.precioVenta) : 0
    const subtotal =
      med && qtyOk ? Math.round(precio * cantidad * 100) / 100 : 0
    return { ...line, med, precio, subtotal, qtyOk }
  })

  const totalPreview =
    Math.round(
      previewLines.reduce((sum, l) => sum + (l.subtotal || 0), 0) * 100,
    ) / 100

  function refresh() {
    setTick((t) => t + 1)
  }

  function updateLine(index, field, value) {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)),
    )
  }

  function addLine() {
    setLines((prev) => [...prev, emptyLine()])
  }

  function removeLine(index) {
    setLines((prev) =>
      prev.length <= 1 ? [emptyLine()] : prev.filter((_, i) => i !== index),
    )
  }

  function resetForm() {
    setLines([emptyLine()])
    setClienteId('')
    setErrors([])
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSuccess('')
    setErrors([])

    const ok = window.confirm(
      `¿Confirmar venta por Q ${totalPreview.toFixed(2)}? Se descontará el stock.`,
    )
    if (!ok) return

    const result = ventasService.crearVenta({
      clienteId: clienteId || null,
      items: lines.map((l) => ({
        medicamentoId: l.medicamentoId,
        cantidad: l.cantidad,
      })),
    })

    if (!result.ok) {
      setErrors(result.errors)
      return
    }

    setSuccess(
      `Venta registrada. Total Q ${Number(result.data.total).toFixed(2)}.`,
    )
    resetForm()
    refresh()
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Ventas / Caja</h1>
        <p className="page-lead">
          Registre ventas multi-ítem con validación de stock y consulte el
          historial.
        </p>
      </header>

      <div className="panel form-panel">
        <h2>Nueva venta</h2>
        {errors.length > 0 && (
          <ul className="alert alert-error">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        {success && <p className="alert alert-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <label className="field" style={{ maxWidth: '20rem', marginBottom: '1rem' }}>
            <span>Cliente (opcional)</span>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            >
              <option value="">Mostrador / sin cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </label>

          <div className="table-wrap" style={{ marginBottom: '1rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {previewLines.map((line, index) => (
                  <tr key={`line-${index}`}>
                    <td>
                      <select
                        value={line.medicamentoId}
                        onChange={(e) =>
                          updateLine(index, 'medicamentoId', e.target.value)
                        }
                        required
                        aria-label={`Medicamento línea ${index + 1}`}
                      >
                        <option value="">Seleccione…</option>
                        {medicamentos.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{line.med ? line.med.stock : '—'}</td>
                    <td>
                      {line.med
                        ? `Q ${Number(line.med.precioVenta).toFixed(2)}`
                        : '—'}
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={line.cantidad}
                        onChange={(e) =>
                          updateLine(index, 'cantidad', e.target.value)
                        }
                        required
                        style={{ width: '5rem' }}
                        aria-label={`Cantidad línea ${index + 1}`}
                      />
                    </td>
                    <td>
                      {line.med && line.qtyOk
                        ? `Q ${line.subtotal.toFixed(2)}`
                        : '—'}
                    </td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeLine(index)}
                        disabled={lines.length <= 1}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-actions venta-actions">
            <button type="button" className="btn btn-ghost" onClick={addLine}>
              Agregar ítem
            </button>
            <p className="venta-total">
              Total: <strong>Q {totalPreview.toFixed(2)}</strong>
            </p>
            <button type="submit" className="btn btn-primary">
              Confirmar venta
            </button>
          </div>
        </form>
      </div>

      <header className="page-header" style={{ marginTop: '0.5rem' }}>
        <h2>Historial de ventas</h2>
        <p className="page-lead">Ventas registradas (más recientes primero).</p>
      </header>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Resumen</th>
              <th>Total</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-cell">
                  No hay ventas registradas.
                </td>
              </tr>
            ) : (
              ventas.map((v) => (
                <Fragment key={v.id}>
                  <tr>
                    <td>{formatFecha(v.fecha)}</td>
                    <td>{v.clienteNombre || 'Mostrador'}</td>
                    <td className="muted small">{v.itemsResumen || '—'}</td>
                    <td>
                      <strong>Q {Number(v.total).toFixed(2)}</strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() =>
                          setExpandedId((id) => (id === v.id ? null : v.id))
                        }
                      >
                        {expandedId === v.id ? 'Ocultar' : 'Ver ítems'}
                      </button>
                    </td>
                  </tr>
                  {expandedId === v.id && (
                    <tr className="detail-row">
                      <td colSpan={5}>
                        <ul className="venta-detalle">
                          {(v.items ?? []).map((it, i) => (
                            <li key={`${v.id}-it-${i}`}>
                              {it.nombreMedicamento} — {it.cantidad} × Q{' '}
                              {Number(it.precioUnitario).toFixed(2)} = Q{' '}
                              {Number(it.subtotal).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

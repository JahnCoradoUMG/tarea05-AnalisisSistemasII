import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { resetDatosDemo } from '../repositories/bootstrap'
import * as dashboardService from '../services/dashboardService'

export default function DashboardPage() {
  const [tick, setTick] = useState(0)

  const resumen = useMemo(() => dashboardService.getResumen(), [tick])

  function handleReset() {
    const ok = window.confirm(
      '¿Restablecer datos de demostración? Se borrarán cambios locales y se cargarán de nuevo los seeds.',
    )
    if (!ok) return
    resetDatosDemo()
    setTick((t) => t + 1)
  }

  const { ventasHoy, stockBajo, proximosVencer } = resumen

  return (
    <section className="page">
      <header className="page-header row-between">
        <div>
          <h1>Dashboard</h1>
          <p className="page-lead">
            Resumen operativo: ventas del día, stock bajo y próximos
            vencimientos.
          </p>
        </div>
        <div className="actions">
          <Link to="/ventas" className="btn btn-primary">
            Ir a ventas
          </Link>
          <Link to="/medicamentos" className="btn">
            Ver inventario
          </Link>
          <button type="button" className="btn btn-ghost" onClick={handleReset}>
            Restablecer datos de demostración
          </button>
        </div>
      </header>

      <div className="dash-stats">
        <article className="dash-stat">
          <p className="dash-stat-label">Ventas del día</p>
          <p className="dash-stat-value">{ventasHoy.conteo}</p>
          <p className="muted small">Cantidad de tickets</p>
        </article>
        <article className="dash-stat">
          <p className="dash-stat-label">Monto del día</p>
          <p className="dash-stat-value">
            Q {Number(ventasHoy.monto).toFixed(2)}
          </p>
          <p className="muted small">Suma de totales</p>
        </article>
        <article className="dash-stat">
          <p className="dash-stat-label">Stock bajo</p>
          <p className="dash-stat-value">{stockBajo.length}</p>
          <p className="muted small">Medicamentos en alerta</p>
        </article>
        <article className="dash-stat">
          <p className="dash-stat-label">Por vencer</p>
          <p className="dash-stat-value">{proximosVencer.length}</p>
          <p className="muted small">En los próximos 30 días</p>
        </article>
      </div>

      <div className="dash-columns">
        <section className="panel">
          <h2>Stock bajo</h2>
          {stockBajo.length === 0 ? (
            <p className="empty-inline">No hay medicamentos con stock bajo.</p>
          ) : (
            <ul className="dash-list">
              {stockBajo.map((m) => (
                <li key={m.id}>
                  <span>
                    <strong>{m.nombre}</strong>
                    <span className="muted small"> · umbral {m.umbral}</span>
                  </span>
                  <span className="badge badge-warn">Stock: {m.stock}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="dash-link">
            <Link to="/medicamentos">Ir a Medicamentos →</Link>
          </p>
        </section>

        <section className="panel">
          <h2>Próximos a vencer</h2>
          {proximosVencer.length === 0 ? (
            <p className="empty-inline">
              No hay medicamentos próximos a vencer.
            </p>
          ) : (
            <ul className="dash-list">
              {proximosVencer.map((m) => (
                <li key={m.id}>
                  <span>
                    <strong>{m.nombre}</strong>
                    <span className="muted small"> · stock {m.stock}</span>
                  </span>
                  <span className="badge badge-danger">
                    {m.fechaVencimiento}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="dash-link">
            <Link to="/medicamentos">Revisar inventario →</Link>
          </p>
        </section>
      </div>
    </section>
  )
}

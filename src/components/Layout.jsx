import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/medicamentos', label: 'Medicamentos' },
  { to: '/ventas', label: 'Ventas' },
  { to: '/clientes', label: 'Clientes' },
]

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <p className="brand-title">Sistema de Farmacia</p>
            <p className="brand-sub">Inventario y mostrador · MVP</p>
          </div>
        </div>
        <nav className="app-nav" aria-label="Principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        Análisis de Sistemas II · UMG Retalhuleu · Tarea 05
      </footer>
    </div>
  )
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import MedicamentosPage from './pages/MedicamentosPage'
import VentasPage from './pages/VentasPage'
import ClientesPage from './pages/ClientesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="medicamentos" element={<MedicamentosPage />} />
          <Route path="ventas" element={<VentasPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import DashboardRecepcion from "./pages/DashboardRecepcion"
import FormularioPaciente from "./components/pacientes/FormularioPaciente"
import LayoutPrincipal from './components/layout/LayoutPrincipal';
import DetalleTurno from './components/turnos/DetalleTurno';
import NotFound from './components/utils/NotFound';

const RutasProtegidas = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <LayoutPrincipal />;

}


function App() {

  return (
    <>
      <Toaster position="top-right" richColors/>
      <Routes>

        {/*ZONA DE RUTAS PUBLICAS */}
        <Route path='/login' element={<Login />} />

        {/*ZONA DE RUTAS PRIVADAS */}
        <Route element={<RutasProtegidas />}>
          <Route index element={<DashboardRecepcion />} />
          <Route path="nuevo-paciente" element={<FormularioPaciente />} />
          <Route path="turno-detalle/:id" element={<DetalleTurno />} />
          <Route path="*" element={<NotFound />} />
        </Route> 
      </Routes>
    </>
  )
}

export default App;

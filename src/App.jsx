import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import DashboardRecepcion from "./pages/DashboardRecepcion"
import FormularioPaciente from "./components/pacientes/FormularioPaciente"
import LayoutPrincipal from './components/layout/LayoutPrincipal';
import DetalleTurno from './components/turnos/DetalleTurno';
import NotFound from './components/utils/NotFound';

function App() {

  return (
    <>
      <Toaster position="top-right" richColors/>

      <Routes>
        <Route path="/" element={<LayoutPrincipal />}>
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

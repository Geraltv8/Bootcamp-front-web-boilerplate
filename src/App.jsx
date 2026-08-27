import { Toaster } from 'sonner';
import DashboardRecepcion from "./pages/DashboardRecepcion"
import FormularioPaciente from "./components/pacientes/FormularioPaciente"

function App() {

  return (
    <>
      <Toaster position="top-right" richColors/>
      <DashboardRecepcion></DashboardRecepcion>
      <FormularioPaciente></FormularioPaciente>
    </>
  )
}

export default App

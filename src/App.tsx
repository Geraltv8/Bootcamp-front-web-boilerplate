import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import AdminDashboard from './pages/AdminDashboard';
import AgendaPage from './pages/AgendaPage';
import CiudadanoTurnos from './pages/CiudadanoTurnos';
import DashboardRecepcion from './pages/DashboardRecepcion';
import Login from './pages/Login';
import ReservaTurno from './pages/ReservaTurno';
import FormularioPaciente from './components/pacientes/FormularioPaciente';
import DetalleTurno from './components/turnos/DetalleTurno';
import NotFound from './components/utils/NotFound';
import LayoutPrincipal from './components/layout/LayoutPrincipal';
import { getSession } from './auth/session';
import type { UserRole } from './types/Api.type';
import RecepcionNuevoTurno from './pages/RecepcionNuevoTurno';

interface RutaPrivadaProps {
    roles: UserRole[];
}

const RutaPrivada = ({ roles }: RutaPrivadaProps) => {
    const session = getSession();
    if (!session || !session.activo) return <Navigate to="/login" replace />;
    if (!roles.includes(session.rol)) return <Navigate to="/" replace />;
    return <Outlet />;
};

const InicioPorRol = () => {
    const session = getSession();
    if (!session) return <Navigate to="/login" replace />;
    if (session.rol === 'PACIENTE') return <Navigate to="/ciudadano/turnos" replace />;
    if (session.rol === 'ADMIN') return <Navigate to="/admin" replace />;
    if (session.rol === 'RECEPCIONISTA') return <Navigate to="/recepcion" replace />;
    return <Navigate to="/login" replace />;
};

function App() {
    return (
        <>
            <Toaster position="top-right" richColors />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/login/personal" element={<Login />} />
                <Route path="/login/ciudadano" element={<Login />} />

                <Route element={<RutaPrivada roles={['PACIENTE', 'RECEPCIONISTA', 'ADMIN', 'MEDICO']} />}>
                    <Route element={<LayoutPrincipal />}>
                        <Route index element={<InicioPorRol />} />
                        <Route path="ciudadano/turnos" element={<RutaPrivada roles={['PACIENTE']} />}>
                            <Route index element={<CiudadanoTurnos />} />
                        </Route>
                        <Route path="ciudadano/reservar" element={<RutaPrivada roles={['PACIENTE']} />}>
                            <Route index element={<ReservaTurno />} />
                        </Route>
                        <Route path="recepcion" element={<RutaPrivada roles={['RECEPCIONISTA', 'ADMIN']} />}>
                            <Route index element={<DashboardRecepcion />} />
                        </Route>
                        <Route path="recepcion/turnos/nuevo" element={<RutaPrivada roles={['RECEPCIONISTA', 'ADMIN']} />}>
                            <Route index element={<RecepcionNuevoTurno />} />
                        </Route>
                        <Route path="nuevo-paciente" element={<RutaPrivada roles={['RECEPCIONISTA', 'ADMIN']} />}>
                            <Route index element={<FormularioPaciente />} />
                        </Route>
                        <Route path="turno-detalle/:id" element={<RutaPrivada roles={['RECEPCIONISTA', 'ADMIN']} />}>
                            <Route index element={<DetalleTurno />} />
                        </Route>
                        <Route path="admin" element={<RutaPrivada roles={['ADMIN']} />}>
                            <Route index element={<AdminDashboard />} />
                        </Route>
                        <Route path="admin/agendas/:medicoId" element={<RutaPrivada roles={['ADMIN', 'RECEPCIONISTA']} />}>
                            <Route index element={<AgendaPage />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;

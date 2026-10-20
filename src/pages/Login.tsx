import { Card, Container, Nav } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CiudadanoLoginForm from '../components/auth/CiudadanoLoginForm';
import PersonalLoginForm from '../components/auth/PersonalLoginForm';
import { saveSession } from '../auth/session';
import type { AuthResult, UserRole } from '../types/Api.type';

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const ciudadano = location.pathname.endsWith('/ciudadano');
    const onSuccess = (result: AuthResult) => {
        saveSession(result.token);
        const role: UserRole | null = result.paciente ? 'PACIENTE' : null;
        toast.success('Ingreso exitoso.');
        navigate(role === 'PACIENTE' ? '/ciudadano/turnos' : '/', { replace: true });
    };

    return (
        <Container className="min-vh-100 d-flex align-items-center justify-content-center py-5">
            <Card className="border-0 shadow-sm w-100" style={{ maxWidth: 440 }}>
                <Card.Body className="p-4 p-md-5">
                    <p className="text-primary fw-semibold mb-1">Salita Municipal</p>
                    <h1 className="h3 mb-4">Ingresar al sistema</h1>
                    <Nav variant="tabs" className="mb-4" aria-label="Tipo de acceso">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/login/personal" active={!ciudadano}>Personal</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/login/ciudadano" active={ciudadano}>Ciudadano</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    {ciudadano ? <CiudadanoLoginForm onSuccess={onSuccess} /> : <PersonalLoginForm onSuccess={onSuccess} />}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;

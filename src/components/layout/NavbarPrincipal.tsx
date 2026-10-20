import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { clearSession, getSession } from '../../auth/session';

const NavbarPrincipal = () => {
    const session = getSession();
    const navigate = useNavigate();
    const salir = () => {
        clearSession();
        navigate('/login', { replace: true });
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Salita Municipal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {session?.rol === 'PACIENTE' && (
                            <>
                                <Nav.Link as={Link} to="/ciudadano/turnos">Mis turnos</Nav.Link>
                                <Nav.Link as={Link} to="/ciudadano/reservar">Reservar turno</Nav.Link>
                            </>
                        )}
                        {(session?.rol === 'ADMIN' || session?.rol === 'RECEPCIONISTA') && (
                            <>
                                <Nav.Link as={Link} to="/recepcion">Turnos del día</Nav.Link>
                                <Nav.Link as={Link} to="/recepcion/turnos/nuevo">Asignar turno</Nav.Link>
                                <Nav.Link as={Link} to="/nuevo-paciente">Nuevo paciente</Nav.Link>
                            </>
                        )}
                        {session?.rol === 'ADMIN' && <Nav.Link as={Link} to="/admin">Administración</Nav.Link>}
                    </Nav>
                    <Nav>
                        <Navbar.Text className="me-lg-3">{session?.user}</Navbar.Text>
                        <Nav.Link as="button" onClick={salir} className="border-0 bg-transparent text-start">
                            Cerrar sesión
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarPrincipal;
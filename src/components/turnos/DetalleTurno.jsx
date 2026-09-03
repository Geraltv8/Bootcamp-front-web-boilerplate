import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Alert, Badge, Button, Card, Col, Container, ListGroup, Row, Spinner, Stack } from 'react-bootstrap';
import { useFetch } from '../../hooks/useFetch';

const DetalleTurno = () => {
    const { id } = useParams();
    const { data: turnos, isLoading } = useFetch(`/turnos/?id=${id}`);
    const turno = turnos[0];

    if (isLoading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" role="status" />
                <p className="text-body-secondary mt-3">Cargando detalle del turno...</p>
            </Container>
        );
    }

    if (!turno) {
        return (
            <Container className="py-5">
                <Alert variant="warning">
                    No se encontró el turno solicitado.
                </Alert>
                <Button as={Link} to="/" variant="outline-primary">Volver al dashboard</Button>
            </Container>
        );
    }

    const paciente = turno.paciente;
    const fecha = new Date(turno.fechaTurno);
    const historial = paciente?.historialMedico;

    return (
        <Container className="pb-5">
            <Stack direction="horizontal" className="justify-content-between align-items-start mb-4">
                <div>
                    <p className="text-body-secondary mb-1">Detalle del turno</p>
                    <h1 className="h2 mb-0">{paciente?.nombre ?? "Paciente sin asignar"}</h1>
                </div>
                <Badge bg={turno.estado === "atendido" ? "success" : "warning"} text={turno.estado === "atendido" ? undefined : "dark"} className="fs-6">
                    {turno.estado === "atendido" ? "Atendido" : "En espera"}
                </Badge>
            </Stack>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Row className="g-4">
                        <Col xs={12} md={4}>
                            <div className="small text-body-secondary">Fecha y hora</div>
                            <div className="fw-semibold">{fecha.toLocaleDateString("es-AR")}</div>
                            <div>{fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs</div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="small text-body-secondary">Especialidad</div>
                            <div className="fw-semibold text-capitalize">{turno.especialidad}</div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className="small text-body-secondary">Identificador</div>
                            <div className="fw-semibold text-break">{turno.id}</div>
                        </Col>
                    </Row>
                    {turno.observaciones && <Card.Text className="border-top pt-3 mt-4 mb-0"><strong>Observaciones:</strong> {turno.observaciones}</Card.Text>}
                </Card.Body>
            </Card>

            {!paciente ? (
                <Alert variant="info">Este turno todavía no tiene un paciente asignado.</Alert>
            ) : (
                <Row className="g-4">
                    <Col xs={12} lg={6}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Header className="bg-white fw-semibold">Datos del paciente</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item><span className="text-body-secondary">DNI</span><br />{paciente.dni}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Email</span><br />{paciente.email}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Telefono</span><br />{paciente.telefono ? `(${paciente.telefono.codigoArea}) ${paciente.telefono.numero}` : "No registrado"}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Direccion</span><br />{paciente.direccion ? `${paciente.direccion.calle} ${paciente.direccion.numero}, ${paciente.direccion.barrio}` : "No registrada"}</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col xs={12} lg={6}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Header className="bg-white fw-semibold">Informacion medica</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item><span className="text-body-secondary">Obra social</span><br />{paciente.obraSocial ? `${paciente.obraSocial.nombre} · Afiliado ${paciente.obraSocial.numeroAfiliado}` : "No registrada"}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Ultimo diagnostico</span><br />{historial?.diagnostico ?? "Sin datos"}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Tratamiento</span><br />{historial?.tratamiento ?? "Sin datos"}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Medico</span><br />{historial?.medico ?? "Sin datos"}</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )}

            <Button as={Link} to="/" variant="outline-secondary" className="mt-4">Volver al dashboard</Button>
        </Container>
    );
};

export default DetalleTurno;
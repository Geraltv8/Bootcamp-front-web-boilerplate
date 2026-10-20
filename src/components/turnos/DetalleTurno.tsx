import { useState } from 'react';
import { Alert, Badge, Card, Col, Container, Form, ListGroup, Placeholder, Row, Stack } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import GeneradorResumenIA from './GeneradorResumenIA';
import useApiQuery from '../../hooks/useApiQuery';
import type { Turno } from '../../types/Api.type';

const DetalleTurno = () => {
    const { id } = useParams();
    const { data: turno, isLoading, error } = useApiQuery<Turno>(id ? `/turnos/${id}` : null);
    const [notas, setNotas] = useState('');

    if (isLoading) {
        return (
            <Container className="py-5" aria-busy="true">
                <Placeholder as="div" animation="glow"><Placeholder xs={6} size="lg" /></Placeholder>
                <Card className="border-0 shadow-sm mt-4"><Card.Body><Placeholder as="p" animation="glow"><Placeholder xs={8} /></Placeholder><Placeholder as="p" animation="glow"><Placeholder xs={5} /></Placeholder></Card.Body></Card>
            </Container>
        );
    }

    if (error || !turno) {
        return (
            <Container className="py-5">
                <Alert variant="warning">{error ?? 'No se encontró el turno solicitado.'}</Alert>
                <Link to="/recepcion" className="btn btn-outline-primary">Volver al dashboard</Link>
            </Container>
        );
    }

    const paciente = turno.paciente;
    const fecha = new Date(turno.fechaTurno);
    const historial = paciente?.historialMedico;
    const medico = typeof turno.medicoId === 'object' ? turno.medicoId : null;
    const consultorio = typeof turno.consultorioId === 'object' ? turno.consultorioId : null;
    const estadoVariant = turno.estado === 'atendido' ? 'success' : turno.estado === 'ausente' ? 'secondary' : turno.estado === 'cancelado' ? 'danger' : 'warning';

    return (
        <Container className="pb-5">
            <Stack direction="horizontal" className="justify-content-between align-items-start mb-4">
                <div>
                    <p className="text-body-secondary mb-1">Detalle del turno</p>
                    <h1 className="h2 mb-0">{paciente?.nombre ?? 'Paciente no asignado'}</h1>
                </div>
                <Badge bg={estadoVariant} text={estadoVariant === 'warning' ? 'dark' : undefined} className="fs-6">{turno.estado}</Badge>
            </Stack>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Row className="g-4">
                        <Col xs={12} md={3}><div className="small text-body-secondary">Fecha y hora</div><strong>{fecha.toLocaleString('es-AR')}</strong></Col>
                        <Col xs={12} md={3}><div className="small text-body-secondary">Especialidad</div><strong className="text-capitalize">{turno.especialidad}</strong></Col>
                        <Col xs={12} md={3}><div className="small text-body-secondary">Profesional</div><strong>{medico ? `${medico.nombre} ${medico.apellido}` : 'A confirmar'}</strong></Col>
                        <Col xs={12} md={3}><div className="small text-body-secondary">Consultorio</div><strong>{consultorio?.nombre ?? 'A confirmar'}{consultorio?.piso ? ` · Piso ${consultorio.piso}` : ''}</strong></Col>
                    </Row>
                    {turno.observaciones && <p className="border-top pt-3 mt-4 mb-0"><strong>Observaciones:</strong> {turno.observaciones}</p>}
                </Card.Body>
            </Card>
            {!paciente ? (
                <Alert variant="info">Este turno todavía no tiene un paciente asociado.</Alert>
            ) : (
                <Row className="g-4">
                    <Col xs={12} lg={6}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Header className="bg-white fw-semibold">Datos del paciente</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item><span className="text-body-secondary">DNI</span><br />{paciente.dni}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Email</span><br />{paciente.email ?? 'No registrado'}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Teléfono</span><br />{paciente.telefono ? `(${paciente.telefono.codigoArea ?? ''}) ${paciente.telefono.numero ?? ''}` : 'No registrado'}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Dirección</span><br />{paciente.direccion ? `${paciente.direccion.calle ?? ''} ${paciente.direccion.numero ?? ''}, ${paciente.direccion.barrio ?? ''}` : 'No registrada'}</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col xs={12} lg={6}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Header className="bg-white fw-semibold">Información médica</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item><span className="text-body-secondary">Obra social</span><br />{paciente.obraSocial ? `${paciente.obraSocial.nombre} · Afiliado ${paciente.obraSocial.numeroAfiliado ?? 's/n'}` : 'No registrada'}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Último diagnóstico</span><br />{historial?.diagnostico ?? 'Sin datos'}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Tratamiento</span><br />{historial?.tratamiento ?? 'Sin datos'}</ListGroup.Item>
                                <ListGroup.Item><span className="text-body-secondary">Profesional</span><br />{historial?.medico ?? 'Sin datos'}</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )}

            <Card className="mt-4 border-0 shadow-sm">
                <Card.Body>
                    <Form.Group controlId="notasTurno">
                        <Form.Label className="fw-semibold">Notas para análisis</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={notas}
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setNotas(event.target.value)}
                            placeholder="Escribe las notas para generar un resumen…"
                        />
                    </Form.Group>
                </Card.Body>
            </Card>
            <GeneradorResumenIA notasCrudas={notas} />
            <Link to="/recepcion" className="btn btn-outline-secondary mt-4">Volver a recepción</Link>
        </Container>
    );
};

export default DetalleTurno;

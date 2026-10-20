import { useMemo } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Placeholder, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import useApiQuery from '../../hooks/useApiQuery';
import type { Turno } from '../../types/Api.type';

const MisTurnos = () => {
    const { data: turnos, isLoading, error, reload } = useApiQuery<Turno[]>('/turnos/me');
    const { mutate: cancelar, isLoading: cancelando } = useApiMutation<string, Turno>(
        'patch',
        (input) => `/turnos/${input}/cancelacion`,
        false,
    );
    const turnosPendientes = useMemo(() => turnos ?? [], [turnos]);

    const cancelarTurno = async (turnoId: string) => {
        try {
            await cancelar(turnoId);
            toast.success('Turno cancelado.');
            await reload();
        } catch (requestError: unknown) {
            toast.error(getApiErrorMessage(requestError, 'No se pudo cancelar el turno.'));
        }
    };

    return (
        <Container className="py-4">
            <Stack direction="horizontal" className="justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 mb-1">Mis turnos</h1>
                    <p className="text-body-secondary mb-0">Tus próximos turnos pendientes.</p>
                </div>
                <Link className="btn btn-primary" to="/ciudadano/reservar">Solicitar turno</Link>
            </Stack>

            {error && <Alert variant="danger">{error}</Alert>}
            {isLoading && (
                <Row className="g-3">
                    {[1, 2, 3].map((item) => (
                        <Col xs={12} md={6} key={item}>
                            <Card><Card.Body><Placeholder as="div" animation="glow"><Placeholder xs={6} /></Placeholder><Placeholder as="div" animation="glow" className="mt-3"><Placeholder xs={12} style={{ height: 48 }} /></Placeholder></Card.Body></Card>
                        </Col>
                    ))}
                </Row>
            )}
            {!isLoading && !error && turnosPendientes.length === 0 && (
                <Alert variant="info">
                    Todavía no tienes turnos pendientes. <Link to="/ciudadano/reservar">Reserva tu primer turno.</Link>
                </Alert>
            )}
            {!isLoading && (
                <Row className="g-3">
                    {turnosPendientes.map((turno) => {
                        const fecha = new Date(turno.fechaTurno);
                        const puedeCancelar = fecha.getTime() - Date.now() >= 2 * 60 * 60 * 1000;
                        const medico = typeof turno.medicoId === 'object' ? turno.medicoId : null;
                        const consultorio = typeof turno.consultorioId === 'object' ? turno.consultorioId : null;
                        return (
                            <Col xs={12} md={6} key={turno.id}>
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body>
                                        <Stack direction="horizontal" className="justify-content-between align-items-start">
                                            <Card.Title className="h5">{turno.especialidad}</Card.Title>
                                            <Badge bg="primary">Pendiente</Badge>
                                        </Stack>
                                        <p className="mb-1">
                                            {fecha.toLocaleDateString('es-AR', { dateStyle: 'full' })} ·{' '}
                                            {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                                        </p>
                                        {medico && <p className="text-body-secondary mb-1">Dr/a. {medico.nombre} {medico.apellido}</p>}
                                        <p className="text-body-secondary mb-3">
                                            Consultorio: {consultorio?.nombre ?? 'A confirmar'}
                                            {consultorio?.piso ? ` · Piso ${consultorio.piso}` : ''}
                                        </p>
                                        <Button
                                            variant="outline-danger"
                                            disabled={!puedeCancelar || cancelando}
                                            onClick={() => void cancelarTurno(turno.id)}
                                        >
                                            {cancelando ? 'Cancelando…' : 'Cancelar turno'}
                                        </Button>
                                        {!puedeCancelar && <small className="d-block mt-2 text-body-secondary">La cancelación se habilita hasta 2 horas antes.</small>}
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default MisTurnos;

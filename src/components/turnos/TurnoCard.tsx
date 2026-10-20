import { Badge, Button, Card, Col, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Turno } from '../../types/Api.type';

interface TurnoCardProps {
    turno: Turno;
    isBusy: boolean;
    onCambiarEstado: (estado: 'atendido' | 'ausente') => void;
}

const TurnoCard = ({ turno, isBusy, onCambiarEstado }: TurnoCardProps) => {
    const fecha = new Date(turno.fechaTurno);
    const medico = typeof turno.medicoId === 'object' ? turno.medicoId : null;
    const consultorio = typeof turno.consultorioId === 'object' ? turno.consultorioId : null;
    const badgeColor = turno.estado === 'atendido'
        ? 'success'
        : turno.estado === 'ausente'
            ? 'secondary'
            : turno.estado === 'cancelado'
                ? 'danger'
                : 'warning';
    return (
        <Col xs={12} md={6} lg={4} className="mb-3">
            <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                    <Stack direction="horizontal" className="justify-content-between align-items-start">
                        <Card.Title className="h5">{turno.paciente?.nombre ?? 'Paciente no asignado'}</Card.Title>
                        <Badge bg={badgeColor} text={badgeColor === 'warning' ? 'dark' : undefined}>{turno.estado}</Badge>
                    </Stack>
                    {turno.paciente?.dni && <p className="small text-body-secondary mb-2">DNI: {turno.paciente.dni}</p>}
                    <p className="mb-1"><strong>{fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs</strong> · {turno.especialidad}</p>
                    {medico && <p className="small mb-1">Dr/a. {medico.nombre} {medico.apellido}</p>}
                    <p className="small text-body-secondary mb-3">
                        Consultorio: {consultorio?.nombre ?? 'A confirmar'}
                        {consultorio?.piso ? ` · Piso ${consultorio.piso}` : ''}
                    </p>
                    <Stack direction="horizontal" gap={2} className="flex-wrap">
                        <Link to={`/turno-detalle/${turno.id}`} className="btn btn-outline-secondary btn-sm">Detalle</Link>
                        {turno.estado === 'pendiente' && (
                            <>
                                <Button size="sm" disabled={isBusy} onClick={() => onCambiarEstado('atendido')}>Atendido</Button>
                                <Button size="sm" variant="outline-dark" disabled={isBusy} onClick={() => onCambiarEstado('ausente')}>Ausente</Button>
                            </>
                        )}
                    </Stack>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default TurnoCard;

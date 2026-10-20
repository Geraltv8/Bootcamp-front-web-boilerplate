import { Alert, Button, Col, Placeholder, Row } from 'react-bootstrap';
import type { HorarioDisponible } from '../../../types/Api.type';

interface HorarioStepProps {
    horarios: HorarioDisponible[] | null;
    error: string | null;
    isLoading: boolean;
    onSelect: (horario: HorarioDisponible) => void;
}

const HorarioStep = ({ horarios, error, isLoading, onSelect }: HorarioStepProps) => (
    <>
        {error && <Alert variant="danger">{error}</Alert>}
        {isLoading && (
            <Row className="g-2">
                {[1, 2, 3, 4].map((item) => (
                    <Col xs={6} md={3} key={item}>
                        <Placeholder as="div" animation="glow"><Placeholder xs={12} style={{ height: 42 }} /></Placeholder>
                    </Col>
                ))}
            </Row>
        )}
        {!isLoading && !error && horarios?.length === 0 && (
            <Alert variant="info">No hay horarios disponibles para esta fecha. Prueba otro día.</Alert>
        )}
        {!isLoading && (
            <Row className="g-2">
                {horarios?.map((horario) => (
                    <Col xs={6} md={4} key={`${horario.medicoId}-${horario.fechaHoraInicio}`}>
                        <Button type="button" variant="outline-primary" className="w-100" onClick={() => onSelect(horario)}>
                            {new Date(horario.fechaHoraInicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                            <small className="d-block">{horario.nombreMedico}</small>
                        </Button>
                    </Col>
                ))}
            </Row>
        )}
    </>
);

export default HorarioStep;

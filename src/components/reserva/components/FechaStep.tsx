import { Form } from 'react-bootstrap';

interface FechaStepProps {
    fecha: string;
    fechaMinima: string;
    fechaMaxima: string;
    onChange: (fecha: string) => void;
}

const FechaStep = ({ fecha, fechaMinima, fechaMaxima, onChange }: FechaStepProps) => (
    <Form.Group controlId="fechaTurno">
        <Form.Label>Fecha</Form.Label>
        <Form.Control
            type="date"
            value={fecha}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
            min={fechaMinima}
            max={fechaMaxima}
        />
        <Form.Text>Solo se pueden consultar los próximos 30 días.</Form.Text>
    </Form.Group>
);

export default FechaStep;

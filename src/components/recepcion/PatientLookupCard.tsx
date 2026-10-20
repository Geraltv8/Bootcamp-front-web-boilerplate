import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, Button, Card, Form, Placeholder, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { patientLookupFormSchema } from '../../types/schemas/recepcion.schema';
import type { PacienteResumen } from '../../types/Api.type';
import { z } from 'zod';

type PatientLookupInput = z.input<typeof patientLookupFormSchema>;

interface PatientLookupCardProps {
    initialDni: string;
    dniBuscado: string;
    paciente: PacienteResumen | null;
    isLoading: boolean;
    error: string | null;
    onSearch: (dni: string) => void;
}

const PatientLookupCard = ({ initialDni, dniBuscado, paciente, isLoading, error, onSearch }: PatientLookupCardProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PatientLookupInput>({
        resolver: zodResolver(patientLookupFormSchema),
        defaultValues: { dni: initialDni },
    });

    return (
        <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
                <h2 className="h5">Buscar paciente</h2>
                <Form onSubmit={handleSubmit((values) => onSearch(values.dni))} noValidate>
                    <Stack direction="horizontal" gap={2} className="align-items-end">
                        <Form.Group controlId="dniBusqueda" className="flex-grow-1">
                            <Form.Label>DNI</Form.Label>
                            <Form.Control inputMode="numeric" {...register('dni')} isInvalid={Boolean(errors.dni)} />
                            <Form.Control.Feedback type="invalid">{errors.dni?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" disabled={isSubmitting}>Buscar</Button>
                    </Stack>
                </Form>
                {isLoading && <Placeholder as="div" animation="glow" className="mt-3"><Placeholder xs={12} style={{ height: 56 }} /></Placeholder>}
                {paciente && (
                    <Alert variant="success" className="mt-3 mb-0">
                        Paciente: <strong>{paciente.nombre}</strong> · DNI {paciente.dni}
                    </Alert>
                )}
                {!isLoading && error && (
                    <Alert variant="warning" className="mt-3 mb-0">
                        No se encontró un paciente activo con ese DNI.{' '}
                        <Link to={`/nuevo-paciente?dni=${encodeURIComponent(dniBuscado)}`}>Registrar paciente</Link>
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
};

export default PatientLookupCard;

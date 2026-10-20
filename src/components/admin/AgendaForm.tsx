import { Button, Card, Form, Stack } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import type { CrearAgendaFormInput } from '../../types/schemas/agenda.schema';

interface AgendaFormProps {
    isEditing: boolean;
    isSaving: boolean;
    onCancel: () => void;
    onSubmit: (values: CrearAgendaFormInput) => Promise<void>;
}

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const AgendaForm = ({ isEditing, isSaving, onCancel, onSubmit }: AgendaFormProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useFormContext<CrearAgendaFormInput>();

    return (
        <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
                <h2 className="h5">{isEditing ? 'Editar disponibilidad' : 'Nueva disponibilidad semanal'}</h2>
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack direction="horizontal" gap={3} className="flex-wrap align-items-end">
                        <Form.Group controlId="diaSemana">
                            <Form.Label>Día</Form.Label>
                            <Form.Select {...register('diaSemana', { valueAsNumber: true })} isInvalid={Boolean(errors.diaSemana)}>
                                {diasSemana.map((dia, index) => <option key={dia} value={index}>{dia}</option>)}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.diaSemana?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="horaInicio">
                            <Form.Label>Desde</Form.Label>
                            <Form.Control type="time" {...register('horaInicio')} isInvalid={Boolean(errors.horaInicio)} />
                            <Form.Control.Feedback type="invalid">{errors.horaInicio?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="horaFin">
                            <Form.Label>Hasta</Form.Label>
                            <Form.Control type="time" {...register('horaFin')} isInvalid={Boolean(errors.horaFin)} />
                            <Form.Control.Feedback type="invalid">{errors.horaFin?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="duracion">
                            <Form.Label>Duración (minutos)</Form.Label>
                            <Form.Control type="number" min={1} {...register('duracionMinutos', { valueAsNumber: true })} isInvalid={Boolean(errors.duracionMinutos)} />
                            <Form.Control.Feedback type="invalid">{errors.duracionMinutos?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" disabled={isSubmitting || isSaving}>
                            {isSubmitting || isSaving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear agenda'}
                        </Button>
                        {isEditing && <Button type="button" variant="outline-secondary" onClick={onCancel}>Cancelar</Button>}
                    </Stack>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default AgendaForm;

import { Form, Placeholder } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import type { Medico } from '../../../types/Api.type';
import type { CrearTurnoFormInput } from '../../../types/schemas/turno.schema';

interface ProfesionalStepProps {
    medicos: Medico[] | null;
    isLoading: boolean;
}

const ProfesionalStep = ({ medicos, isLoading }: ProfesionalStepProps) => {
    const { register } = useFormContext<CrearTurnoFormInput>();

    return (
        <Form.Group controlId="medicoId">
            <Form.Label>Profesional (opcional)</Form.Label>
            {isLoading ? <Placeholder as="div" animation="glow"><Placeholder xs={12} style={{ height: 40 }} /></Placeholder> : (
                <Form.Select {...register('medicoId', { setValueAs: (value: string) => value || undefined })}>
                    <option value="">Sin preferencia</option>
                    {medicos?.map((medico) => (
                        <option key={medico.id} value={medico.id}>{medico.nombre} {medico.apellido}</option>
                    ))}
                </Form.Select>
            )}
            <Form.Text>Si no eliges profesional, mostraremos disponibilidad de todos los médicos de esta especialidad.</Form.Text>
        </Form.Group>
    );
};

export default ProfesionalStep;

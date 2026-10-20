import { Form, Placeholder } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import type { Especialidad } from '../../../types/Api.type';
import type { CrearTurnoFormInput } from '../../../types/schemas/turno.schema';

interface EspecialidadStepProps {
    especialidades: Especialidad[] | null;
    isLoading: boolean;
}

const EspecialidadStep = ({ especialidades, isLoading }: EspecialidadStepProps) => {
    const { register, formState: { errors } } = useFormContext<CrearTurnoFormInput>();

    return (
        <Form.Group controlId="especialidadId">
            <Form.Label>Especialidad médica</Form.Label>
            {isLoading ? <Placeholder as="div" animation="glow"><Placeholder xs={12} style={{ height: 40 }} /></Placeholder> : (
                <Form.Select {...register('especialidadId')} isInvalid={Boolean(errors.especialidadId)}>
                    <option value="">Selecciona una especialidad</option>
                    {especialidades?.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                </Form.Select>
            )}
            <Form.Control.Feedback type="invalid">{errors.especialidadId?.message}</Form.Control.Feedback>
        </Form.Group>
    );
};

export default EspecialidadStep;

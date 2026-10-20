import { Alert, Stack } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';
import type { HorarioDisponible } from '../../../types/Api.type';
import type { CrearTurnoFormInput } from '../../../types/schemas/turno.schema';

interface ConfirmacionStepProps {
    especialidadNombre?: string;
    horarios: HorarioDisponible[] | null;
}

const ConfirmacionStep = ({ especialidadNombre, horarios }: ConfirmacionStepProps) => {
    const { watch } = useFormContext<CrearTurnoFormInput>();
    const fechaHoraInicio = watch('fechaHoraInicio');
    const slot = horarios?.find((horario) => horario.fechaHoraInicio === fechaHoraInicio);

    return (
        <Stack gap={2}>
            <p className="mb-0"><strong>Especialidad:</strong> {especialidadNombre ?? '—'}</p>
            <p className="mb-0"><strong>Profesional:</strong> {slot?.nombreMedico ?? 'A asignar'}</p>
            <p className="mb-0"><strong>Fecha:</strong> {new Date(fechaHoraInicio).toLocaleString('es-AR')}</p>
            <Alert variant="info" className="mt-2 mb-0">El horario se confirma cuando el servidor complete la reserva.</Alert>
        </Stack>
    );
};

export default ConfirmacionStep;

import { useCallback, useMemo, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import PatientLookupCard from './PatientLookupCard';
import ReceptionBookingForm from './ReceptionBookingForm';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import useApiQuery from '../../hooks/useApiQuery';
import type { Consultorio, Especialidad, HorarioDisponible, Medico, PacienteResumen, Turno } from '../../types/Api.type';
import type { ReceptionBookingFormInput } from '../../types/schemas/recepcion.schema';

const fechaLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const RecepcionNuevoTurnoWorkflow = () => {
    const [searchParams] = useSearchParams();
    const initialDni = searchParams.get('dni') ?? '';
    const [dniBuscado, setDniBuscado] = useState(initialDni);
    const [fecha, setFecha] = useState('');
    const [especialidadId, setEspecialidadId] = useState('');
    const [medicoId, setMedicoId] = useState<string | undefined>();

    const patientSearch = useApiQuery<PacienteResumen>(
        dniBuscado ? `/recepcion/pacientes?dni=${encodeURIComponent(dniBuscado)}` : null,
    );
    const especialidades = useApiQuery<Especialidad[]>('/especialidades');
    const especialidad = useMemo(
        () => especialidades.data?.find((item) => item.id === especialidadId),
        [especialidades.data, especialidadId],
    );
    const medicos = useApiQuery<Medico[]>(
        especialidad ? `/medicos?especialidad=${encodeURIComponent(especialidad.codigo)}&activo=true` : null,
    );
    const consultorios = useApiQuery<Consultorio[]>('/consultorio');
    const horariosUrl = especialidadId && fecha
        ? `/turnos/disponibilidad?especialidadId=${encodeURIComponent(especialidadId)}&fecha=${encodeURIComponent(fecha)}${medicoId ? `&medicoId=${encodeURIComponent(medicoId)}` : ''}`
        : null;
    const horarios = useApiQuery<HorarioDisponible[]>(horariosUrl);
    const { mutate: registrarTurno, isLoading } = useApiMutation<ReceptionBookingFormInput, Turno>('post', '/recepcion/turnos');

    const onFiltersChange = useCallback((specialtyId: string, doctorId?: string) => {
        setEspecialidadId(specialtyId);
        setMedicoId(doctorId);
    }, []);

    const buscarPaciente = useCallback((dni: string) => {
        setDniBuscado(dni);
    }, []);

    const onSubmit = async (values: ReceptionBookingFormInput): Promise<boolean> => {
        if (!patientSearch.data || patientSearch.data.dni !== dniBuscado) {
            toast.error('Primero busca y confirma al paciente por DNI.');
            return false;
        }
        try {
            await registrarTurno({
                dni: values.dni,
                especialidadId: values.especialidadId,
                fechaHoraInicio: values.fechaHoraInicio,
                ...(values.medicoId ? { medicoId: values.medicoId } : {}),
                ...(values.consultorioId ? { consultorioId: values.consultorioId } : {}),
            });
            toast.success('Turno asignado al paciente.');
            return true;
        } catch (requestError: unknown) {
            toast.error(getApiErrorMessage(requestError, 'No se pudo asignar el turno.'));
            return false;
        }
    };

    const fechaMinima = fechaLocal(new Date());
    const fechaMaximaDate = new Date();
    fechaMaximaDate.setDate(fechaMaximaDate.getDate() + 30);
    const fechaMaxima = fechaLocal(fechaMaximaDate);

    return (
        <Container className="py-4" style={{ maxWidth: 900 }}>
            <h1 className="h2 mb-4">Asignar turno presencial</h1>
            <PatientLookupCard
                initialDni={initialDni}
                dniBuscado={dniBuscado}
                paciente={patientSearch.data}
                isLoading={patientSearch.isLoading}
                error={patientSearch.error}
                onSearch={buscarPaciente}
            />
            <ReceptionBookingForm
                dni={dniBuscado}
                especialidades={especialidades.data}
                medicos={medicos.data}
                consultorios={consultorios.data}
                horarios={horarios.data}
                horariosError={horarios.error}
                isLoadingHorarios={horarios.isLoading}
                isLoadingMutation={isLoading}
                fecha={fecha}
                fechaMinima={fechaMinima}
                fechaMaxima={fechaMaxima}
                pacienteConfirmado={Boolean(patientSearch.data && patientSearch.data.dni === dniBuscado)}
                onFechaChange={setFecha}
                onSubmit={onSubmit}
                onFiltersChange={onFiltersChange}
                onSuccess={() => setFecha('')}
            />
        </Container>
    );
};

export default RecepcionNuevoTurnoWorkflow;

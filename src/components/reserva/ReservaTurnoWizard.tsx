import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Card, Container, Form, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createAppointmentFormSchema } from '../../types/schemas/turno.schema';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import useApiQuery from '../../hooks/useApiQuery';
import type { Especialidad, HorarioDisponible, Medico, Turno } from '../../types/Api.type';
import type { CrearTurnoFormInput } from '../../types/schemas/turno.schema';
import EspecialidadStep from './components/EspecialidadStep';
import ProfesionalStep from './components/ProfesionalStep';
import FechaStep from './components/FechaStep';
import HorarioStep from './components/HorarioStep';
import ConfirmacionStep from './components/ConfirmacionStep';

const pasos = ['Especialidad', 'Profesional', 'Fecha', 'Horario', 'Confirmar'];

const fechaLocal = (fecha: Date): string => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const ReservaTurnoWizard = () => {
    const navigate = useNavigate();
    const [paso, setPaso] = useState(0);
    const [fecha, setFecha] = useState('');
    const form = useForm<CrearTurnoFormInput>({
        resolver: zodResolver(createAppointmentFormSchema),
        defaultValues: { especialidadId: '', medicoId: undefined, fechaHoraInicio: '' },
    });
    const { handleSubmit, watch, setValue, trigger, formState: { isSubmitting } } = form;

    const especialidadId = watch('especialidadId');
    const medicoId = watch('medicoId');
    const especialidades = useApiQuery<Especialidad[]>('/especialidades');
    const especialidad = useMemo(
        () => especialidades.data?.find((item) => item.id === especialidadId),
        [especialidades.data, especialidadId],
    );
    const medicosUrl = especialidad
        ? `/medicos?especialidad=${encodeURIComponent(especialidad.codigo)}&activo=true`
        : null;
    const medicos = useApiQuery<Medico[]>(medicosUrl);
    const disponibilidadUrl = especialidadId && fecha
        ? `/turnos/disponibilidad?especialidadId=${encodeURIComponent(especialidadId)}&fecha=${encodeURIComponent(fecha)}${medicoId ? `&medicoId=${encodeURIComponent(medicoId)}` : ''}`
        : null;
    const horarios = useApiQuery<HorarioDisponible[]>(disponibilidadUrl);
    const { mutate: reservar, isLoading } = useApiMutation<CrearTurnoFormInput, Turno>('post', '/turnos');
    const fechaMinima = fechaLocal(new Date());
    const fechaMaximaDate = new Date();
    fechaMaximaDate.setDate(fechaMaximaDate.getDate() + 30);
    const fechaMaxima = fechaLocal(fechaMaximaDate);

    const avanzar = async () => {
        if (paso === 0 && !(await trigger('especialidadId'))) return;
        if (paso === 2 && !fecha) {
            toast.error('Selecciona una fecha para continuar.');
            return;
        }
        if (paso === 3 && !watch('fechaHoraInicio')) {
            toast.error('Selecciona un horario disponible.');
            return;
        }
        setPaso((actual) => Math.min(actual + 1, 4));
    };

    const elegirHorario = (horario: HorarioDisponible) => {
        setValue('fechaHoraInicio', horario.fechaHoraInicio, { shouldValidate: true });
        if (!medicoId) setValue('medicoId', horario.medicoId);
        setPaso(4);
    };

    const onSubmit = async (values: CrearTurnoFormInput) => {
        try {
            const body: CrearTurnoFormInput = {
                especialidadId: values.especialidadId,
                fechaHoraInicio: values.fechaHoraInicio,
                ...(values.medicoId ? { medicoId: values.medicoId } : {}),
            };
            await reservar(body);
            toast.success('Turno reservado correctamente.');
            navigate('/ciudadano/turnos', { replace: true });
        } catch (requestError: unknown) {
            toast.error(getApiErrorMessage(requestError, 'No se pudo reservar el horario. Elige otro turno e inténtalo nuevamente.'));
            setPaso(3);
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: 860 }}>
            <h1 className="h2 mb-2">Reservar un turno</h1>
            <p className="text-body-secondary">Completa cada paso para ver horarios realmente disponibles.</p>
            <ProgressBar now={(paso + 1) * 20} label={`Paso ${paso + 1} de 5`} className="mb-4" />

            <FormProvider {...form}>
            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Card className="shadow-sm border-0">
                    <Card.Body className="p-4">
                        <h2 className="h4 mb-4">{pasos[paso]}</h2>

                        {paso === 0 && <EspecialidadStep especialidades={especialidades.data} isLoading={especialidades.isLoading} />}
                        {paso === 1 && <ProfesionalStep medicos={medicos.data} isLoading={medicos.isLoading} />}
                        {paso === 2 && (
                            <FechaStep
                                fecha={fecha}
                                fechaMinima={fechaMinima}
                                fechaMaxima={fechaMaxima}
                                onChange={setFecha}
                            />
                        )}
                        {paso === 3 && (
                            <HorarioStep
                                horarios={horarios.data}
                                error={horarios.error}
                                isLoading={horarios.isLoading}
                                onSelect={elegirHorario}
                            />
                        )}
                        {paso === 4 && <ConfirmacionStep especialidadNombre={especialidad?.nombre} horarios={horarios.data} />}
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between bg-white p-3">
                        <Button
                            type="button"
                            variant="outline-secondary"
                            disabled={paso === 0 || isSubmitting || isLoading}
                            onClick={() => setPaso((actual) => Math.max(actual - 1, 0))}
                        >
                            Atrás
                        </Button>
                        {paso < 4 ? (
                            <Button
                                type="button"
                                disabled={isSubmitting || (paso === 3 && horarios.isLoading)}
                                onClick={() => void avanzar()}
                            >
                                Continuar
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isSubmitting || isLoading}>
                                {isSubmitting || isLoading ? 'Reservando…' : 'Confirmar turno'}
                            </Button>
                        )}
                    </Card.Footer>
                </Card>
            </Form>
            </FormProvider>
        </Container>
    );
};

export default ReservaTurnoWizard;

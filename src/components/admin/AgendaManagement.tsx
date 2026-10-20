import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { createAgendaFormSchema } from '../../types/schemas/agenda.schema';
import type { CrearAgendaFormInput, CrearAgendaFormOutput } from '../../types/schemas/agenda.schema';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import useApiQuery from '../../hooks/useApiQuery';
import { getSession } from '../../auth/session';
import type { Agenda } from '../../types/Api.type';
import AgendaForm from './AgendaForm';
import AgendaList from './AgendaList';

const AgendaManagement = () => {
    const { medicoId = '' } = useParams();
    const isAdmin = getSession()?.rol === 'ADMIN';
    const [agendaEditando, setAgendaEditando] = useState<Agenda | null>(null);
    const agendas = useApiQuery<Agenda[]>(medicoId ? `/medicos/${medicoId}/agendas?incluirInactivas=true` : null);
    const { mutate: crearAgenda, isLoading: creando } = useApiMutation<{ medicoId: string; body: CrearAgendaFormOutput }, Agenda>(
        'post',
        (input) => `/medicos/${input.medicoId}/agendas`,
        true,
        (input) => input.body,
    );
    const { mutate: actualizarAgenda, isLoading: actualizando } = useApiMutation<{ id: string; body: CrearAgendaFormOutput }, Agenda>(
        'patch',
        (input) => `/agendas/${input.id}`,
        true,
        (input) => input.body,
    );
    const { mutate: eliminarAgenda, isLoading: eliminando } = useApiMutation<string, Agenda>(
        'delete',
        (id) => `/agendas/${id}`,
        false,
    );
    const form = useForm<CrearAgendaFormInput, unknown, CrearAgendaFormOutput>({
        resolver: zodResolver(createAgendaFormSchema),
        defaultValues: { diaSemana: 1, horaInicio: '09:00', horaFin: '17:00', duracionMinutos: 30 },
    });
    const { reset } = form;

    useEffect(() => {
        reset(agendaEditando
            ? {
                diaSemana: agendaEditando.diaSemana,
                horaInicio: agendaEditando.horaInicio,
                horaFin: agendaEditando.horaFin,
                duracionMinutos: agendaEditando.duracionMinutos,
            }
            : { diaSemana: 1, horaInicio: '09:00', horaFin: '17:00', duracionMinutos: 30 });
    }, [agendaEditando, reset]);

    const onSubmit = async (values: CrearAgendaFormOutput) => {
        try {
            if (agendaEditando) {
                await actualizarAgenda({ id: agendaEditando.id, body: values });
            } else {
                await crearAgenda({ medicoId, body: values });
            }
            toast.success(agendaEditando ? 'Agenda actualizada.' : 'Agenda creada.');
            setAgendaEditando(null);
            await agendas.reload();
        } catch (requestError: unknown) {
            toast.error(getApiErrorMessage(requestError, 'No se pudo guardar la agenda.'));
        }
    };

    const darDeBaja = async (id: string) => {
        try {
            await eliminarAgenda(id);
            toast.success('Agenda dada de baja.');
            await agendas.reload();
        } catch (requestError: unknown) {
            toast.error(getApiErrorMessage(requestError, 'No se pudo dar de baja la agenda.'));
        }
    };

    return (
        <Container className="py-4">
            <Link to="/admin" className="btn btn-link px-0">← Volver a administración</Link>
            <h1 className="h2 mb-4">Agenda médica</h1>
            {isAdmin && (
                <FormProvider {...form}>
                    <AgendaForm
                        isEditing={Boolean(agendaEditando)}
                        isSaving={creando || actualizando}
                        onCancel={() => setAgendaEditando(null)}
                        onSubmit={onSubmit}
                    />
                </FormProvider>
            )}
            <AgendaList
                agendas={agendas.data}
                isLoading={agendas.isLoading}
                error={agendas.error}
                isAdmin={isAdmin}
                isDeleting={eliminando}
                onEdit={setAgendaEditando}
                onDelete={(id) => void darDeBaja(id)}
            />
        </Container>
    );
};

export default AgendaManagement;

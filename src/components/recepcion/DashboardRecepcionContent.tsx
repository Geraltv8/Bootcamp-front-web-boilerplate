import { useMemo, useState } from 'react';
import { Alert, Container, Form, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import TurnoCard from '../turnos/TurnoCard';
import TurnoCardSkeleton from '../turnos/TurnoCardSkeleton';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import useApiQuery from '../../hooks/useApiQuery';
import type { Turno } from '../../types/Api.type';

const fechaLocal = (fecha: Date): string => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const DashboardRecepcionContent = () => {
    const [busqueda, setBusqueda] = useState('');
    const [fecha, setFecha] = useState(fechaLocal(new Date()));
    const [turnoEnProceso, setTurnoEnProceso] = useState<string | null>(null);
    const { data: turnos, isLoading, error, reload } = useApiQuery<Turno[]>(`/turnos?fecha=${fecha}`);
    const { mutate: cambiarEstado } = useApiMutation<{ id: string; estado: 'atendido' | 'ausente' }, Turno>(
        'patch',
        (input) => `/turnos/${input.id}/estado`,
    );

    const filtrados = useMemo(() => (turnos ?? []).filter((turno) => {
        const query = busqueda.trim().toLocaleLowerCase();
        if (!query) return true;
        return `${turno.paciente?.nombre ?? ''} ${turno.paciente?.dni ?? ''} ${turno.especialidad}`
            .toLocaleLowerCase()
            .includes(query);
    }), [busqueda, turnos]);

    const guardarEstado = async (id: string, estado: 'atendido' | 'ausente') => {
        setTurnoEnProceso(id);
        try {
            await cambiarEstado({ id, estado });
            toast.success(estado === 'atendido' ? 'Turno marcado como atendido.' : 'Turno marcado como ausente.');
            await reload();
        } catch (requestError: unknown) {
            toast.error(getApiErrorMessage(requestError, 'No se pudo actualizar el turno.'));
        } finally {
            setTurnoEnProceso(null);
        }
    };

    return (
        <Container className="py-4">
            <Stack direction="horizontal" className="justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 mb-1">Agenda de recepción</h1>
                    <p className="text-body-secondary mb-0">Turnos ordenados por horario.</p>
                </div>
                <Link className="btn btn-primary" to="/recepcion/turnos/nuevo">Asignar turno</Link>
            </Stack>
            <Stack direction="horizontal" gap={3} className="mb-4 flex-wrap">
                <Form.Group controlId="fechaDashboard">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                        type="date"
                        value={fecha}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFecha(event.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="buscarTurno" className="flex-grow-1">
                    <Form.Label>Buscar paciente, DNI o especialidad</Form.Label>
                    <Form.Control value={busqueda} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBusqueda(event.target.value)} />
                </Form.Group>
            </Stack>
            {error && <Alert variant="danger">{error}</Alert>}
            {!isLoading && !error && filtrados.length === 0 && <Alert variant="info">No hay turnos para mostrar en esta fecha.</Alert>}
            <div className="row">
                {isLoading
                    ? [1, 2, 3].map((item) => <TurnoCardSkeleton key={item} />)
                    : filtrados.map((turno) => (
                        <TurnoCard
                            key={turno.id}
                            turno={turno}
                            isBusy={turnoEnProceso === turno.id}
                            onCambiarEstado={(estado) => void guardarEstado(turno.id, estado)}
                        />
                    ))}
            </div>
        </Container>
    );
};

export default DashboardRecepcionContent;

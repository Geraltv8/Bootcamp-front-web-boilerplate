import { Alert, Button, Card, Placeholder, Stack, Table } from 'react-bootstrap';
import type { Agenda } from '../../types/Api.type';

interface AgendaListProps {
    agendas: Agenda[] | null;
    isLoading: boolean;
    error: string | null;
    isAdmin: boolean;
    isDeleting: boolean;
    onEdit: (agenda: Agenda) => void;
    onDelete: (id: string) => void;
}

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const AgendaList = ({ agendas, isLoading, error, isAdmin, isDeleting, onEdit, onDelete }: AgendaListProps) => (
    <>
        {error && <Alert variant="danger">{error}</Alert>}
        <Card className="border-0 shadow-sm">
            <Card.Body>
                <h2 className="h5">Disponibilidades</h2>
                {isLoading ? <Placeholder as="p" animation="glow" aria-label="Cargando agendas"><Placeholder xs={8} /></Placeholder> : (
                    <Table responsive hover>
                        <thead><tr><th>Día</th><th>Horario</th><th>Duración</th><th>Estado</th>{isAdmin && <th>Acciones</th>}</tr></thead>
                        <tbody>
                            {agendas?.map((agenda) => (
                                <tr key={agenda.id}>
                                    <td>{diasSemana[agenda.diaSemana] ?? agenda.diaSemana}</td>
                                    <td>{agenda.horaInicio}–{agenda.horaFin}</td>
                                    <td>{agenda.duracionMinutos} min</td>
                                    <td>{agenda.activo ? 'Activa' : 'Inactiva'}</td>
                                    {isAdmin && (
                                        <td>
                                            <Stack direction="horizontal" gap={2}>
                                                <Button size="sm" variant="outline-primary" disabled={!agenda.activo} onClick={() => onEdit(agenda)}>Editar</Button>
                                                {agenda.activo && <Button size="sm" variant="outline-danger" disabled={isDeleting} onClick={() => onDelete(agenda.id)}>Dar de baja</Button>}
                                            </Stack>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    </>
);

export default AgendaList;

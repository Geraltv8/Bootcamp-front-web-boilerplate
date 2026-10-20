import { Alert, Badge, Button, Card, Placeholder, Stack, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import useApiQuery from '../../hooks/useApiQuery';
import type { Medico } from '../../types/Api.type';

interface DoctorsListProps {
    onEdit: (doctor: Medico) => void;
}

const DoctorsList = ({ onEdit }: DoctorsListProps) => {
    const doctors = useApiQuery<Medico[]>('/medicos');
    const { mutate: darBajaMedico, isLoading: inactivandoMedico } = useApiMutation<string, Medico>(
        'delete',
        (id) => `/medicos/${id}`,
        false,
    );

    const inactivarMedico = async (id: string) => {
        try {
            await darBajaMedico(id);
            toast.success('Médico dado de baja.');
            await doctors.reload();
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, 'No se pudo dar de baja el médico.'));
        }
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body>
                <h2 className="h5">Médicos registrados</h2>
                {doctors.isLoading && <Placeholder as="p" animation="glow" aria-label="Cargando médicos"><Placeholder xs={8} /></Placeholder>}
                {doctors.error && <Alert variant="danger">{doctors.error}</Alert>}
                <div className="table-responsive">
                    <Table hover className="align-middle">
                        <thead><tr><th>Profesional</th><th>Matrícula</th><th>Especialidades</th><th>Acciones</th></tr></thead>
                        <tbody>
                            {doctors.data?.map((doctor) => (
                                <tr key={doctor.id}>
                                    <td>{doctor.nombre} {doctor.apellido}<Badge bg={doctor.activo ? 'success' : 'secondary'} className="ms-2">{doctor.activo ? 'Activo' : 'Inactivo'}</Badge></td>
                                    <td>{doctor.matricula}</td>
                                    <td>{doctor.especialidades.join(', ')}</td>
                                    <td>
                                        <Stack direction="horizontal" gap={2}>
                                            <Button size="sm" variant="outline-primary" onClick={() => onEdit(doctor)}>Editar</Button>
                                            <Link className="btn btn-sm btn-outline-secondary" to={`/admin/agendas/${doctor.id}`}>Agendas</Link>
                                            {doctor.activo && <Button size="sm" variant="outline-danger" disabled={inactivandoMedico} onClick={() => void inactivarMedico(doctor.id)}>Dar de baja</Button>}
                                        </Stack>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default DoctorsList;

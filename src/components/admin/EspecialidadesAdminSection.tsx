import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, Button, Card, Col, Form, Placeholder, Row, Stack, Table } from 'react-bootstrap';
import { toast } from 'sonner';
import { createSpecialtyFormSchema, updateSpecialtyFormSchema } from '../../types/schemas/especialidad.schema';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import useApiQuery from '../../hooks/useApiQuery';
import type { Especialidad } from '../../types/Api.type';

type CreateSpecialtyInput = z.input<typeof createSpecialtyFormSchema>;
type CreateSpecialtyOutput = z.output<typeof createSpecialtyFormSchema>;
type UpdateSpecialtyInput = z.input<typeof updateSpecialtyFormSchema>;

const EspecialidadesAdminSection = () => {
    const [especialidadEditando, setEspecialidadEditando] = useState<Especialidad | null>(null);
    const especialidades = useApiQuery<Especialidad[]>('/especialidades?incluirInactivas=true');
    const { mutate: guardarEspecialidad, isLoading: guardandoEspecialidad } = useApiMutation<
        { id?: string; body: CreateSpecialtyOutput | UpdateSpecialtyInput },
        Especialidad
    >((input) => input.id ? 'patch' : 'post', (input) => input.id ? `/especialidades/${input.id}` : '/especialidades', true, (input) => input.body);
    const { mutate: darBajaEspecialidad, isLoading: dandoBaja } = useApiMutation<string, Especialidad>(
        'delete',
        (id) => `/especialidades/${id}`,
        false,
    );
    const specialtyForm = useForm<CreateSpecialtyInput, unknown, CreateSpecialtyOutput>({
        resolver: zodResolver(createSpecialtyFormSchema),
        defaultValues: { nombre: '', descripcion: '' },
    });
    const { reset } = specialtyForm;

    useEffect(() => {
        reset(especialidadEditando
            ? { nombre: especialidadEditando.nombre, descripcion: especialidadEditando.descripcion ?? '' }
            : { nombre: '', descripcion: '' });
    }, [especialidadEditando, reset]);

    const guardarPerfilEspecialidad = async (values: CreateSpecialtyOutput) => {
        try {
            if (especialidadEditando) {
                await guardarEspecialidad({
                    id: especialidadEditando.id,
                    body: { nombre: values.nombre, descripcion: values.descripcion },
                });
            } else {
                await guardarEspecialidad({ body: values });
            }
            toast.success(especialidadEditando ? 'Especialidad actualizada.' : 'Especialidad creada.');
            setEspecialidadEditando(null);
            specialtyForm.reset({ nombre: '', descripcion: '' });
            await especialidades.reload();
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, 'No se pudo guardar la especialidad.'));
        }
    };

    const inactivarEspecialidad = async (id: string) => {
        try {
            await darBajaEspecialidad(id);
            toast.success('Especialidad dada de baja.');
            await especialidades.reload();
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, 'No se pudo dar de baja la especialidad.'));
        }
    };

    return (
        <Row className="g-4">
            <Col xs={12} md={5}>
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <h2 className="h5">{especialidadEditando ? 'Editar especialidad' : 'Nueva especialidad'}</h2>
                        <Form onSubmit={specialtyForm.handleSubmit(guardarPerfilEspecialidad)} noValidate>
                            <Form.Group className="mb-3" controlId="especialidadNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control {...specialtyForm.register('nombre')} isInvalid={Boolean(specialtyForm.formState.errors.nombre)} />
                                <Form.Control.Feedback type="invalid">{specialtyForm.formState.errors.nombre?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="especialidadDescripcion">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control as="textarea" rows={3} {...specialtyForm.register('descripcion')} isInvalid={Boolean(specialtyForm.formState.errors.descripcion)} />
                                <Form.Control.Feedback type="invalid">{specialtyForm.formState.errors.descripcion?.message}</Form.Control.Feedback>
                            </Form.Group>
                            <Stack direction="horizontal" gap={2}>
                                <Button type="submit" disabled={specialtyForm.formState.isSubmitting || guardandoEspecialidad}>
                                    {especialidadEditando ? 'Guardar cambios' : 'Crear especialidad'}
                                </Button>
                                {especialidadEditando && <Button type="button" variant="outline-secondary" onClick={() => setEspecialidadEditando(null)}>Cancelar</Button>}
                            </Stack>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col xs={12} md={7}>
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <h2 className="h5">Catálogo</h2>
                        {especialidades.error && <Alert variant="danger">{especialidades.error}</Alert>}
                        {especialidades.isLoading ? <Placeholder as="p" animation="glow" aria-label="Cargando especialidades"><Placeholder xs={8} /></Placeholder> : (
                            <Table responsive hover>
                                <thead><tr><th>Nombre</th><th>Código</th><th>Estado</th><th>Acciones</th></tr></thead>
                                <tbody>
                                    {especialidades.data?.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.nombre}</td>
                                            <td>{item.codigo}</td>
                                            <td>{item.activo ? 'Activa' : 'Inactiva'}</td>
                                            <td>
                                                <Stack direction="horizontal" gap={2}>
                                                    <Button size="sm" variant="outline-primary" onClick={() => setEspecialidadEditando(item)}>Editar</Button>
                                                    {item.activo && <Button size="sm" variant="outline-danger" disabled={dandoBaja} onClick={() => void inactivarEspecialidad(item.id)}>Dar de baja</Button>}
                                                </Stack>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default EspecialidadesAdminSection;

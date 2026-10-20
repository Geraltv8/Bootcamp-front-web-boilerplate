import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';
import { toast } from 'sonner';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import { createDoctorFormSchema } from '../../types/schemas/medico.schema';
import type { Especialidad, Medico } from '../../types/Api.type';
import type { CreatedMedicalAccount } from './DoctorAccountForm';

type DoctorProfileInput = z.input<typeof createDoctorFormSchema>;
type DoctorProfileOutput = z.output<typeof createDoctorFormSchema>;

interface DoctorProfileFormProps {
    account: CreatedMedicalAccount | null;
    editingDoctor: Medico | null;
    especialidades: Especialidad[];
    onSaved: () => void;
    onCancel: () => void;
}

const defaultValues: DoctorProfileInput = {
    usuarioId: '',
    nombre: '',
    apellido: '',
    matricula: '',
    especialidades: [],
    telefono: '',
};

const DoctorProfileForm = ({ account, editingDoctor, especialidades, onSaved, onCancel }: DoctorProfileFormProps) => {
    const { mutate: guardarMedico, isLoading } = useApiMutation<
        { id?: string; body: DoctorProfileOutput },
        Medico
    >((input) => input.id ? 'patch' : 'post', (input) => input.id ? `/medicos/${input.id}` : '/medicos', true, (input) => input.body);
    const form = useForm<DoctorProfileInput, unknown, DoctorProfileOutput>({
        resolver: zodResolver(createDoctorFormSchema),
        defaultValues,
    });
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

    useEffect(() => {
        if (editingDoctor) {
            const usuarioId = editingDoctor.usuarioId;
            reset({
                usuarioId: typeof usuarioId === 'string' ? usuarioId : usuarioId?.id ?? usuarioId?._id ?? '',
                nombre: editingDoctor.nombre,
                apellido: editingDoctor.apellido,
                matricula: editingDoctor.matricula,
                especialidades: editingDoctor.especialidades,
                telefono: editingDoctor.telefono ?? '',
            });
        } else if (account) {
            reset({ ...defaultValues, usuarioId: account.id });
        } else {
            reset(defaultValues);
        }
    }, [account, editingDoctor, reset]);

    const guardarPerfilMedico = async (values: DoctorProfileOutput) => {
        try {
            await guardarMedico({ ...(editingDoctor ? { id: editingDoctor.id } : {}), body: values });
            toast.success(editingDoctor ? 'Perfil médico actualizado.' : 'Perfil médico creado.');
            onSaved();
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, 'No se pudo guardar el perfil médico.'));
        }
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body>
                <h2 className="h5">2. Perfil profesional</h2>
                {account && !editingDoctor && <Alert variant="info">Cuenta lista: {account.email}</Alert>}
                {editingDoctor && <Alert variant="warning">Editando perfil de {editingDoctor.nombre}.</Alert>}
                <Form onSubmit={handleSubmit(guardarPerfilMedico)} noValidate>
                    <Form.Group className="mb-3" controlId="medicoAccountId">
                        <Form.Label>ID de cuenta médica</Form.Label>
                        <Form.Control {...register('usuarioId')} readOnly isInvalid={Boolean(errors.usuarioId)} />
                        <Form.Control.Feedback type="invalid">{errors.usuarioId?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Row className="g-2">
                        <Col sm={6}>
                            <Form.Group className="mb-3" controlId="medicoNombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control {...register('nombre')} isInvalid={Boolean(errors.nombre)} />
                                <Form.Control.Feedback type="invalid">{errors.nombre?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="mb-3" controlId="medicoApellido">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control {...register('apellido')} isInvalid={Boolean(errors.apellido)} />
                                <Form.Control.Feedback type="invalid">{errors.apellido?.message}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3" controlId="medicoMatricula">
                        <Form.Label>Matrícula</Form.Label>
                        <Form.Control {...register('matricula')} isInvalid={Boolean(errors.matricula)} />
                        <Form.Control.Feedback type="invalid">{errors.matricula?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="medicoEspecialidades">
                        <Form.Label>Especialidades</Form.Label>
                        <Form.Select multiple {...register('especialidades')}>
                            {especialidades.filter((item) => item.activo).map((item) => (
                                <option key={item.id} value={item.codigo}>{item.nombre}</option>
                            ))}
                        </Form.Select>
                        {errors.especialidades?.message && <small className="text-danger">{errors.especialidades.message}</small>}
                        <Form.Text>Usa Ctrl o Cmd para seleccionar más de una.</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="medicoTelefono">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control {...register('telefono')} isInvalid={Boolean(errors.telefono)} />
                        <Form.Control.Feedback type="invalid">{errors.telefono?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Stack direction="horizontal" gap={2}>
                        <Button type="submit" disabled={isSubmitting || isLoading || (!account && !editingDoctor)}>
                            {isSubmitting || isLoading ? 'Guardando…' : editingDoctor ? 'Actualizar médico' : 'Crear perfil médico'}
                        </Button>
                        {(account || editingDoctor) && <Button type="button" variant="outline-secondary" onClick={onCancel}>Cancelar</Button>}
                    </Stack>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default DoctorProfileForm;

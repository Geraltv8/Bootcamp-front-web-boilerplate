import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { createPatientFormSchema } from '../../types/schemas/paciente.schema';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import type { PacienteResumen } from '../../types/Api.type';
import { ObraSocial, TipoTelefono } from '../../types/schemas/common.schema';
import { z } from 'zod';

type CreatePatientInput = z.input<typeof createPatientFormSchema>;
type CreatePatientOutput = z.output<typeof createPatientFormSchema>;

const FormularioPaciente = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { mutate: crearPaciente, isLoading } = useApiMutation<CreatePatientOutput, PacienteResumen>('post', '/pacientes');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreatePatientInput, unknown, CreatePatientOutput>({
        resolver: zodResolver(createPatientFormSchema),
        defaultValues: {
            nombre: '',
            dni: searchParams.get('dni') ?? '',
            direccion: { calle: 'Sin información', numero: 'S/N', piso: '', departamento: '', barrio: 'Sin información' },
            email: '',
            telefono: { tipo: TipoTelefono.CELULAR, codigoArea: '', numero: '' },
            obraSocial: { nombre: ObraSocial.NINGUNA, numeroAfiliado: '' },
            historialMedico: { fecha: new Date().toISOString().slice(0, 10), diagnostico: '', tratamiento: '', medico: '' },
        },
    });

    const onSubmit = async (values: CreatePatientOutput) => {
        try {
            await crearPaciente(values);
            toast.success('Paciente registrado.');
            navigate(`/recepcion/turnos/nuevo?dni=${encodeURIComponent(values.dni)}`);
        } catch (requestError: unknown) {
            toast.error(getApiErrorMessage(requestError, 'No se pudo registrar el paciente.'));
        }
    };

    return (
        <Container className="py-4">
            <h1 className="h2 mb-4">Registrar paciente</h1>
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <h2 className="h5 mb-3">Datos personales</h2>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group controlId="nombre">
                                    <Form.Label>Nombre completo</Form.Label>
                                    <Form.Control {...register('nombre')} isInvalid={Boolean(errors.nombre)} />
                                    <Form.Control.Feedback type="invalid">{errors.nombre?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="dni">
                                    <Form.Label>DNI</Form.Label>
                                    <Form.Control inputMode="numeric" {...register('dni')} isInvalid={Boolean(errors.dni)} />
                                    <Form.Control.Feedback type="invalid">{errors.dni?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="email">
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control type="email" {...register('email')} isInvalid={Boolean(errors.email)} />
                                    <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="telefonoTipo">
                                    <Form.Label>Tipo de teléfono</Form.Label>
                                    <Form.Select {...register('telefono.tipo')}>
                                        {Object.values(TipoTelefono).map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="telefonoNumero">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control type="tel" {...register('telefono.numero')} isInvalid={Boolean(errors.telefono?.numero)} />
                                    <Form.Control.Feedback type="invalid">{errors.telefono?.numero?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="obraSocial">
                                    <Form.Label>Obra social</Form.Label>
                                    <Form.Select {...register('obraSocial.nombre')}>
                                        {Object.values(ObraSocial).map((obraSocial) => <option key={obraSocial} value={obraSocial}>{obraSocial}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="numeroAfiliado">
                                    <Form.Label>Número de afiliado</Form.Label>
                                    <Form.Control {...register('obraSocial.numeroAfiliado')} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="calle">
                                    <Form.Label>Calle</Form.Label>
                                    <Form.Control {...register('direccion.calle')} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="numero">
                                    <Form.Label>Número</Form.Label>
                                    <Form.Control {...register('direccion.numero')} />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group controlId="barrio">
                                    <Form.Label>Barrio</Form.Label>
                                    <Form.Control {...register('direccion.barrio')} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h2 className="h5 mt-4 mb-3">Historial médico inicial</h2>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Group controlId="historialFecha">
                                    <Form.Label>Fecha</Form.Label>
                                    <Form.Control type="date" {...register('historialMedico.fecha')} isInvalid={Boolean(errors.historialMedico?.fecha)} />
                                    <Form.Control.Feedback type="invalid">{errors.historialMedico?.fecha?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Form.Group controlId="historialMedico">
                                    <Form.Label>Profesional</Form.Label>
                                    <Form.Control {...register('historialMedico.medico')} isInvalid={Boolean(errors.historialMedico?.medico)} />
                                    <Form.Control.Feedback type="invalid">{errors.historialMedico?.medico?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="diagnostico">
                                    <Form.Label>Diagnóstico</Form.Label>
                                    <Form.Control as="textarea" rows={3} {...register('historialMedico.diagnostico')} isInvalid={Boolean(errors.historialMedico?.diagnostico)} />
                                    <Form.Control.Feedback type="invalid">{errors.historialMedico?.diagnostico?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="tratamiento">
                                    <Form.Label>Tratamiento</Form.Label>
                                    <Form.Control as="textarea" rows={3} {...register('historialMedico.tratamiento')} isInvalid={Boolean(errors.historialMedico?.tratamiento)} />
                                    <Form.Control.Feedback type="invalid">{errors.historialMedico?.tratamiento?.message}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button type="submit" className="mt-4" disabled={isSubmitting || isLoading}>
                            {isSubmitting || isLoading ? 'Guardando…' : 'Registrar paciente'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FormularioPaciente;

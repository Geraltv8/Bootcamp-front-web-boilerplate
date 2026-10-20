import { useFormContext } from 'react-hook-form';
import { Alert, Button, Col, Form, Placeholder, Row } from 'react-bootstrap';
import type { Consultorio, Especialidad, HorarioDisponible, Medico } from '../../types/Api.type';
import type { ReceptionBookingFormInput } from '../../types/schemas/recepcion.schema';

export interface ReceptionBookingFieldsProps {
    especialidades: Especialidad[] | null;
    medicos: Medico[] | null;
    consultorios: Consultorio[] | null;
    horarios: HorarioDisponible[] | null;
    horariosError: string | null;
    isLoadingHorarios: boolean;
    isLoadingMutation: boolean;
    fecha: string;
    fechaMinima: string;
    fechaMaxima: string;
    pacienteConfirmado: boolean;
    isSubmitting: boolean;
    onFechaChange: (fecha: string) => void;
}

const ReceptionBookingFields = ({
    especialidades,
    medicos,
    consultorios,
    horarios,
    horariosError,
    isLoadingHorarios,
    isLoadingMutation,
    fecha,
    fechaMinima,
    fechaMaxima,
    pacienteConfirmado,
    isSubmitting,
    onFechaChange,
}: ReceptionBookingFieldsProps) => {
    const { register, watch, setValue, formState: { errors } } = useFormContext<ReceptionBookingFormInput>();

    return (
        <>
            <Row className="g-3">
                <Col md={6}>
                    <Form.Group controlId="bookingDni">
                        <Form.Label>DNI del paciente</Form.Label>
                        <Form.Control {...register('dni')} readOnly isInvalid={Boolean(errors.dni)} />
                        <Form.Control.Feedback type="invalid">{errors.dni?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="bookingSpecialty">
                        <Form.Label>Especialidad</Form.Label>
                        <Form.Select {...register('especialidadId')} isInvalid={Boolean(errors.especialidadId)}>
                            <option value="">Seleccionar especialidad</option>
                            {especialidades?.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.especialidadId?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="bookingDoctor">
                        <Form.Label>Médico (opcional)</Form.Label>
                        <Form.Select {...register('medicoId', { setValueAs: (value: string) => value || undefined })}>
                            <option value="">Sin preferencia</option>
                            {medicos?.map((medico) => <option key={medico.id} value={medico.id}>{medico.nombre} {medico.apellido}</option>)}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="bookingRoom">
                        <Form.Label>Consultorio (opcional)</Form.Label>
                        <Form.Select {...register('consultorioId', { setValueAs: (value: string) => value || undefined })}>
                            <option value="">Sin asignar</option>
                            {consultorios?.map((item) => <option key={item.id} value={item.id}>{item.nombre}{item.piso ? ` · Piso ${item.piso}` : ''}</option>)}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="bookingDate">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            value={fecha}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                onFechaChange(event.target.value);
                                setValue('fechaHoraInicio', '');
                            }}
                            min={fechaMinima}
                            max={fechaMaxima}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {isLoadingHorarios && <Row className="mt-3 g-2">{[1, 2, 3].map((item) => <Col xs={4} key={item}><Placeholder as="div" animation="glow"><Placeholder xs={12} style={{ height: 42 }} /></Placeholder></Col>)}</Row>}
            {horariosError && <Alert variant="danger" className="mt-3">{horariosError}</Alert>}
            {!isLoadingHorarios && horarios && (
                <fieldset className="mt-4">
                    <legend className="h6">Horarios disponibles</legend>
                    {horarios.length === 0 ? <p className="text-body-secondary">No hay horarios libres para esa selección.</p> : (
                        <Row className="g-2">
                            {horarios.map((slot) => (
                                <Col xs={6} md={3} key={`${slot.medicoId}-${slot.fechaHoraInicio}`}>
                                    <Button
                                        type="button"
                                        variant={watch('fechaHoraInicio') === slot.fechaHoraInicio ? 'primary' : 'outline-primary'}
                                        className="w-100"
                                        onClick={() => {
                                            setValue('fechaHoraInicio', slot.fechaHoraInicio, { shouldValidate: true });
                                            setValue('medicoId', slot.medicoId);
                                        }}
                                    >
                                        {new Date(slot.fechaHoraInicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    )}
                    {errors.fechaHoraInicio && <small className="text-danger">{errors.fechaHoraInicio.message}</small>}
                </fieldset>
            )}

            <Button
                type="submit"
                className="mt-4"
                disabled={isSubmitting || isLoadingMutation || !pacienteConfirmado || !watch('fechaHoraInicio')}
            >
                {isSubmitting || isLoadingMutation ? 'Asignando…' : 'Confirmar turno'}
            </Button>
        </>
    );
};

export default ReceptionBookingFields;

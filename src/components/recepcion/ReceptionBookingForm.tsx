import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { receptionBookingFormSchema } from '../../types/schemas/recepcion.schema';
import type { ReceptionBookingFormInput } from '../../types/schemas/recepcion.schema';
import ReceptionBookingFields, { type ReceptionBookingFieldsProps } from './ReceptionBookingFields';

interface ReceptionBookingFormProps extends Omit<ReceptionBookingFieldsProps, 'isSubmitting'> {
    dni: string;
    onSubmit: (values: ReceptionBookingFormInput) => Promise<boolean>;
    onFiltersChange: (especialidadId: string, medicoId?: string) => void;
    onSuccess: () => void;
}

const ReceptionBookingForm = ({
    dni,
    onSubmit,
    onFiltersChange,
    onSuccess,
    ...fields
}: ReceptionBookingFormProps) => {
    const form = useForm<ReceptionBookingFormInput>({
        resolver: zodResolver(receptionBookingFormSchema),
        defaultValues: { dni, especialidadId: '', fechaHoraInicio: '' },
    });
    const { setValue } = form;
    const especialidadId = useWatch({ control: form.control, name: 'especialidadId' });
    const medicoId = useWatch({ control: form.control, name: 'medicoId' });

    useEffect(() => {
        setValue('dni', dni);
    }, [dni, setValue]);

    useEffect(() => {
        onFiltersChange(especialidadId, medicoId);
    }, [especialidadId, medicoId, onFiltersChange]);

    return (
        <FormProvider {...form}>
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                    <Form onSubmit={form.handleSubmit(async (values) => {
                        if (await onSubmit(values)) {
                            setValue('fechaHoraInicio', '');
                            onSuccess();
                        }
                    })} noValidate>
                        <ReceptionBookingFields {...fields} isSubmitting={form.formState.isSubmitting} />
                    </Form>
                </Card.Body>
            </Card>
        </FormProvider>
    );
};

export default ReceptionBookingForm;

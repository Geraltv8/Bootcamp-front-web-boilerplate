import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Card, Form } from 'react-bootstrap';
import { toast } from 'sonner';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import { createStaffUserFormSchema } from '../../types/schemas/auth.schema';
import { z } from 'zod';

type StaffUserInput = z.input<typeof createStaffUserFormSchema>;
type StaffUserOutput = z.output<typeof createStaffUserFormSchema>;

export interface CreatedMedicalAccount {
    id: string;
    email: string;
}

interface DoctorAccountFormProps {
    onCreated: (account: CreatedMedicalAccount) => void;
}

const DoctorAccountForm = ({ onCreated }: DoctorAccountFormProps) => {
    const { mutate: crearCuenta, isLoading } = useApiMutation<StaffUserOutput, CreatedMedicalAccount>('post', '/auth/register');
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<StaffUserInput, unknown, StaffUserOutput>({
        resolver: zodResolver(createStaffUserFormSchema),
        defaultValues: { email: '', user: '', password: '', rol: 'MEDICO' },
    });

    const crearCuentaMedica = async (values: StaffUserOutput) => {
        try {
            const account = await crearCuenta(values);
            onCreated(account);
            reset({ email: '', user: '', password: '', rol: 'MEDICO' });
            toast.success('Cuenta creada. Completa ahora el perfil médico.');
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, 'No se pudo crear la cuenta.'));
        }
    };

    return (
        <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
                <h2 className="h5">1. Cuenta del médico</h2>
                <p className="small text-body-secondary">La API crea la cuenta y el perfil por separado. Si falla el perfil, completa el registro con la cuenta ya creada.</p>
                <Form onSubmit={handleSubmit(crearCuentaMedica)} noValidate>
                    <Form.Group className="mb-3" controlId="medicoEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" {...register('email')} isInvalid={Boolean(errors.email)} />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="medicoUser">
                        <Form.Label>Usuario (opcional)</Form.Label>
                        <Form.Control {...register('user')} isInvalid={Boolean(errors.user)} />
                        <Form.Control.Feedback type="invalid">{errors.user?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="medicoPassword">
                        <Form.Label>Contraseña inicial</Form.Label>
                        <Form.Control type="password" autoComplete="new-password" {...register('password')} isInvalid={Boolean(errors.password)} />
                        <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <input type="hidden" {...register('rol')} />
                    <Button type="submit" disabled={isSubmitting || isLoading}>Crear cuenta</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default DoctorAccountForm;

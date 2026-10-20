import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import { staffLoginFormSchema } from '../../types/schemas/auth.schema';
import type { AuthResult } from '../../types/Api.type';
import { z } from 'zod';

type PersonalDTO = z.input<typeof staffLoginFormSchema>;

interface PersonalLoginFormProps {
    onSuccess: (result: AuthResult) => void;
}

const PersonalLoginForm = ({ onSuccess }: PersonalLoginFormProps) => {
    const { mutate, isLoading } = useApiMutation<PersonalDTO, AuthResult>('post', '/auth/login');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PersonalDTO>({
        resolver: zodResolver(staffLoginFormSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (values: PersonalDTO) => {
        try {
            onSuccess(await mutate(values));
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, 'No se pudo iniciar sesión.'));
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3" controlId="staffEmail">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" autoComplete="username" {...register('email')} isInvalid={Boolean(errors.email)} />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="staffPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" autoComplete="current-password" {...register('password')} isInvalid={Boolean(errors.password)} />
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="w-100" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? 'Ingresando…' : 'Ingresar'}
            </Button>
        </Form>
    );
};

export default PersonalLoginForm;

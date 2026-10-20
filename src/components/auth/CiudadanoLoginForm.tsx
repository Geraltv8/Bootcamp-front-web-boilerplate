import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import { citizenLoginFormSchema } from '../../types/schemas/auth.schema';
import type { AuthResult } from '../../types/Api.type';
import { z } from 'zod';

type CiudadanoDTO = z.input<typeof citizenLoginFormSchema>;

interface CiudadanoLoginFormProps {
    onSuccess: (result: AuthResult) => void;
}

const CiudadanoLoginForm = ({ onSuccess }: CiudadanoLoginFormProps) => {
    const { mutate, isLoading } = useApiMutation<CiudadanoDTO, AuthResult>('post', '/auth/ciudadano-login');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CiudadanoDTO>({
        resolver: zodResolver(citizenLoginFormSchema),
        defaultValues: { dni: '', telefono: '' },
    });

    const onSubmit = async (values: CiudadanoDTO) => {
        try {
            onSuccess(await mutate(values));
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, 'No se pudo validar el DNI y teléfono.'));
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3" controlId="citizenDni">
                <Form.Label>DNI</Form.Label>
                <Form.Control inputMode="numeric" autoComplete="off" {...register('dni')} isInvalid={Boolean(errors.dni)} />
                <Form.Control.Feedback type="invalid">{errors.dni?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="citizenPhone">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control type="tel" autoComplete="tel" {...register('telefono')} isInvalid={Boolean(errors.telefono)} />
                <Form.Control.Feedback type="invalid">{errors.telefono?.message}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="w-100" disabled={isSubmitting || isLoading}>
                {isSubmitting || isLoading ? 'Validando…' : 'Ingresar al portal'}
            </Button>
        </Form>
    );
};

export default CiudadanoLoginForm;

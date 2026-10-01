import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import clientesAxios from "../config/axios";
import { Button, Container, Card } from "react-bootstrap";

const loginSchema = z.object({
    email: z.email("Formato de email invalido"),
    user: z.string().min(1, "El Usuario es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginDTO = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginDTO>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (datos: LoginDTO) => {
        try {

            const respuesta = await clientesAxios.post('/auth/login', datos);

            const token = respuesta.data.data.token;

            localStorage.setItem('token', token);

            toast.success("Ingreso fue exitoso");
            navigate('/');

        } catch (error: any) {
            toast.error(error.response?.data?.mensaje || "Error al iniciar sesión");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '400px' }} className="p-4 shadow">
                <h3 className="text-center mb-4">Ingreso al Sistema</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <input type="email" className="form-control" placeholder="Email" {...register('email')} />
                        {errors.email && <small className="text-danger">{errors.email.message}</small>}
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" placeholder="usuario" {...register('user')} />
                        {errors.user && <small className="text-danger">{errors.user?.message}</small>}
                    </div>
                    <div className="mb-4">
                        <input type="password" className="form-control" placeholder="Contraseña" {...register('password')} />
                        {errors.password && <small className="text-danger">{errors.password.message}</small>}
                    </div>
                    <Button type="submit" className="w-100" disabled={isSubmitting}>
                        {isSubmitting ? "Ingresando..." : "Ingresar"}
                    </Button>
                </form>
            </Card>
        </Container>
    );
};

export default Login;
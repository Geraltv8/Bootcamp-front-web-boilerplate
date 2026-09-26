import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './FormularioPaciente.module.scss';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import clientesAxios from '../../config/axios';
import DatosPersonales from './components/DatosPersonales';
import DireccionPaciente from './components/DireccionPaciente';
import HistorialMedicoPaciente from './components/HistorialMedicoPaciente';
import ObraSocialPaciente from './components/ObraSocialPaciente';
import TelefonoPaciente from './components/TelefonoPaciente';
import JsonDebugger from '../utils/JsonDebugger';

import { crearPacienteSchema } from '../../types/Paciente.type';
import type { ICrearPacienteDTO } from '../../types/Paciente.type';


const FormularioPaciente = () => {
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ICrearPacienteDTO>({
        resolver: zodResolver(crearPacienteSchema)
    });


    const onSubmit = async (datosValidados: ICrearPacienteDTO) => {
        try {
            await clientesAxios.post('/pacientes', datosValidados);
            alert("Paciente guardado en base de datos");

        } catch (error) {
            console.error("Error de conexion", error);
            const mensaje = axios.isAxiosError(error)
                ? error.response?.data?.message ?? "Error del servidor"
                : "el servidor esta apagado o no responde";
            alert(mensaje);
        }

        console.log(datosValidados);
    };

    return (
        <div className={styles.contenedorFormulario}>
            <h3>Ingreso de Nuevo Paciente</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DatosPersonales
                    register={register}
                    errores={errors}
                    styles={styles}
                />
                <DireccionPaciente
                    register={register}
                    errores={errors}
                    styles={styles}
                />
                <TelefonoPaciente
                    register={register}
                    errores={errors}
                    styles={styles}
                />
                <ObraSocialPaciente
                    register={register}
                    errores={errors}
                    styles={styles}
                />
                <HistorialMedicoPaciente
                    register={register}
                    errores={errors}
                    styles={styles}
                />

                <Button type="submit">Guardar </Button>
            </form>
            <JsonDebugger watch={watch} titulo="ESTADO DEL JSON" />
        </div>
    );
};

export default FormularioPaciente;
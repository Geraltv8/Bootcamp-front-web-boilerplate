import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './FormularioPaciente.module.scss';
import { Button } from 'react-bootstrap';
import DatosPersonales from './components/DatosPersonales';
import DireccionPaciente from './components/DireccionPaciente';
import HistorialMedicoPaciente from './components/HistorialMedicoPaciente';
import ObraSocialPaciente from './components/ObraSocialPaciente';
import TelefonoPaciente from './components/TelefonoPaciente';

import { crearPacienteSchema, ICrearPacienteDTO } from '../../types/Paciente.type';


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
            const respuesta = await fetch("http://localhost:3000/api/v1/pacientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosValidados)
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert("Paciente guardado en base de datos");
            } else {
                alert("error del servidor: " + data.message + "errores: " +data.data);
            }

        } catch (error) {
            console.error("Error de conexion", error);
            alert("el servidor esta apagado o no responde");
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
        </div>
    );
};

export default FormularioPaciente;
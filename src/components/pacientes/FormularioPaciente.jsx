import { useState } from 'react';
import styles from './FormularioPaciente.module.scss';
import JsonDebugger from '../utils/JsonDebugger';

const formularioPaciente = () => {
   const [paciente, setPaciente] = useState({
        nombre: "",
        dni: "",
        email: ""
   });

   const handleChange = (evento) => {
        const { name, value } = evento.target;

        setPaciente({
            ...paciente, /*Spread operator */
            [name]: value
        });
   };

    return (
        <div className={styles.contenedorFormulario}>
            <h3>Ingreso de Nuevo Paciente</h3>
            <form>
                <input 
                    type="text"
                    name="nombre"
                    value={paciente.nombre}
                    className={styles.campoInput}
                    placeholder="Nombre completo"
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    name="dni"
                    value={paciente.dni}
                    className={styles.campoInput}
                    placeholder="DNI"
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    name="email"
                    value={paciente.email}
                    className={styles.campoInput}
                    placeholder="email"
                    onChange={handleChange}
                />
            </form>
            <JsonDebugger
                data={paciente}
                titulo="ESTADO DEL JSON"
            />
        </div>
    );
};

export default formularioPaciente;
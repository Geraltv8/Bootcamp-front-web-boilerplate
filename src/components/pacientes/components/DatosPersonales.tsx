import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ICrearPacienteDTO } from "../../../types/Paciente.type";

interface Props {
    register: UseFormRegister<ICrearPacienteDTO>;
    errores: FieldErrors<ICrearPacienteDTO>;
    styles: any;
}

const DatosPersonales = ({ register, errores, styles }: Props) => (
    <fieldset>
        <legend>Datos Personales</legend>
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Nombre completo"
            {...register('nombre')}
        />
        {errores.nombre && <span className={styles.textoError}>{errores.nombre.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="DNI"
            {...register('dni')}
        />
        {errores.dni && <span className={styles.textoError}>{errores.dni.message}</span>}
        <input
            type="email"
            className={styles.campoInput}
            placeholder="Email"
            {...register('email')}
        />
        {errores.email && <span className={styles.textoError}>{errores.email.message}</span>}
    </fieldset>
);

export default DatosPersonales;

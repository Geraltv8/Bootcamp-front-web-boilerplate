import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ICrearPacienteDTO } from '../../../types/Paciente.type';

interface Props {
    register: UseFormRegister<ICrearPacienteDTO>;
    errores: FieldErrors<ICrearPacienteDTO>;
    styles: any;
}

const ObraSocialPaciente = ({ register, errores, styles }: Props) => (
    <fieldset>
        <legend>Obra Social</legend>
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Nombre Obra Social"
            {...register('obraSocial.nombre')}
        />
        {errores.obraSocial?.nombre && <span className={styles.textoError}>{errores.obraSocial.nombre.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Nº de Afiliado"
            {...register('obraSocial.numeroAfiliado')}
        />
        {errores.obraSocial?.numeroAfiliado && <span className={styles.textoError}>{errores.obraSocial.numeroAfiliado.message}</span>}
    </fieldset>
);

export default ObraSocialPaciente;
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ICrearPacienteDTO } from '../../../types/Paciente.type';

interface Props {
    register: UseFormRegister<ICrearPacienteDTO>;
    errores: FieldErrors<ICrearPacienteDTO>
    styles: any;
}

const DireccionPaciente = ({ register, errores, styles }: Props) => (
    <fieldset>
        <legend>Dirección</legend>
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Calle"
            {...register('direccion.calle')}
        />
        {errores.direccion?.calle && <span className={styles.textoError}>{errores.direccion.calle.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Número"
            {...register('direccion.numero')}
        />
        {errores.direccion?.numero && <span className={styles.textoError}>{errores.direccion.numero.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Piso"
            {...register('direccion.piso')}
        />
        {errores.direccion?.piso && <span className={styles.textoError}>{errores.direccion.piso.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Departamento"
            {...register('direccion.departamento')}
        />
        {errores.direccion?.departamento && <span className={styles.textoError}>{errores.direccion.departamento.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Barrio"
             {...register('direccion.barrio')}
        />
        {errores.direccion?.barrio && <span className={styles.textoError}>{errores.direccion.barrio.message}</span>}
    </fieldset>
);

export default DireccionPaciente;

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ICrearPacienteDTO } from '../../../types/Paciente.type';

interface Props {
    register: UseFormRegister<ICrearPacienteDTO>;
    errores: FieldErrors<ICrearPacienteDTO>;
    styles: any;
}

const TelefonoPaciente = ({ register, errores, styles }: Props) => (
    <fieldset>
        <legend>Teléfono</legend>
        <select
            className={styles.campoInput}
            {...register('telefono.tipo')}
        >
            <option value="CELULAR">Celular</option>
            <option value="FIJO">Fijo</option>
        </select>
        {errores.telefono?.tipo && <span className={styles.textoError}>{errores.telefono.tipo.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Código de Área"
            {...register('telefono.codigoArea')}
        />
        {errores.telefono?.codigoArea && <span className={styles.textoError}>{errores.telefono.codigoArea.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Número de Teléfono"
            {...register('telefono.numero')}
        />
        {errores.telefono?.numero && <span className={styles.textoError}>{errores.telefono.numero.message}</span>}
    </fieldset>
);

export default TelefonoPaciente;
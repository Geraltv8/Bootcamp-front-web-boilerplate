import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ICrearPacienteDTO } from '../../../types/Paciente.type';

interface Props {
    register: UseFormRegister<ICrearPacienteDTO>;
    errores: FieldErrors<ICrearPacienteDTO>;
    styles: any;
}

const HistorialMedicoPaciente = ({ register, errores, styles }: Props) => (
    <fieldset>
        <legend>Historial Médico</legend>
        <input
            type="datetime-local"
            className={styles.campoInput}
            {...register('historialMedico.fecha')}
        />
        {errores.historialMedico?.fecha && <span className={styles.textoError}>{errores.historialMedico.fecha.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Diagnóstico"
            {...register('historialMedico.diagnostico')}
        />
        {errores.historialMedico?.diagnostico && <span className={styles.textoError}>{errores.historialMedico.diagnostico.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Tratamiento"
            {...register('historialMedico.tratamiento')}
        />
        {errores.historialMedico?.tratamiento && <span className={styles.textoError}>{errores.historialMedico.tratamiento.message}</span>}
        <input
            type="text"
            className={styles.campoInput}
            placeholder="Médico a cargo"
            {...register('historialMedico.medico')}
        />
        {errores.historialMedico?.medico && <span className={styles.textoError}>{errores.historialMedico.medico.message}</span>}
    </fieldset>
);

export default HistorialMedicoPaciente;
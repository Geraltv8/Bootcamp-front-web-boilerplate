import { z } from 'zod';

export const idSchema = z.string().regex(/^[a-f\d]{24}$/i, 'El ID debe ser un ObjectId válido');

export enum ObraSocial {
    PAMI = 'PAMI',
    OSPEL = 'OSPEL',
    OSDE = 'OSDE',
    SANCOR = 'SANCOR',
    OSECAC = 'OSECAC',
    SWISS_MEDICAL = 'SWISS MEDICAL',
    GALENO = 'GALENO',
    MEDICUS = 'MEDICUS',
    OMINT = 'OMINT',
    FEMEBA = 'FEMEBA',
    OTRAS = 'OTRAS',
    NINGUNA = 'NINGUNA',
}

export enum TipoTelefono {
    CELULAR = 'CELULAR',
    FIJO = 'FIJO',
    TRABAJO = 'TRABAJO',
}

export enum EstadoTurno {
    PENDIENTE = 'pendiente',
    ATENDIDO = 'atendido',
    CANCELADO = 'cancelado',
    AUSENTE = 'ausente',
}

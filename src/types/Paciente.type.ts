import { z } from 'zod';

export const direccionSchema = z.object({
    calle: z.string(),
    numero: z.string(),
    piso: z.string().optional().default(""),
    departamento: z.string().optional().default(""),
    barrio: z.string().optional().default("")
});

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

export const pacienteSchema = z.object({
    nombre: z.string(),
    dni: z.string(),
    direccion: direccionSchema,
    email: z.email(),
    telefono: z.object({
        tipo: z.enum(TipoTelefono),
        codigoArea: z.string(),
        numero: z.string()
    }),
    obraSocial: z.object({
        nombre: z.enum(ObraSocial),
        numeroAfiliado: z.string()
    }),
    historialMedico: z.object({
        fecha: z.string(),
        diagnostico: z.string(),
        tratamiento: z.string(),
        medico: z.string()
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
    id: z.string()
});

export type IPaciente = z.infer<typeof pacienteSchema>;

export const crearPacienteSchema = z.object({
    nombre: z.string().min(2, "el nombre es obligatorio"),
    dni: z.string().min(7, "DNI invalido"),
    direccion: direccionSchema,
    email: z.email('Email invalido'),
    telefono: z.object({
        tipo: z.enum(TipoTelefono).optional().default(TipoTelefono.CELULAR),
        codigoArea: z.string(),
        numero: z.string()
    }),
    obraSocial: z.object({
        nombre: z.enum(ObraSocial),
        numeroAfiliado: z.string().optional().default("")
    }),
    historialMedico: z.object({
        fecha: z.date({ message: "formato de fecha invalido" }),
        diagnostico: z.string(),
        tratamiento: z.string(),
        medico: z.string()
    }) 
});

export type ICrearPacienteDTO = z.input<typeof crearPacienteSchema>;

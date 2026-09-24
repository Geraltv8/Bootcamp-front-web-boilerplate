import { z } from 'zod';

export interface IPaciente {
    direccion: {
        calle: string;
        numero: string;
        piso: string;
        departamento: string;
        barrio: string;
    };
    telefono: {
        tipo: string;
        codigoArea: string;
        numero: string;
    };
    obraSocial: {
        nombre: string;
        numeroAfiliado: string;
    };
    historialMedico: {
        fecha: string;
        diagnostico: string;
        tratamiento: string;
        medico: string;
    };
    nombre: string;
    dni: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

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
        fecha: z.iso.date({ message: "formato de fecha invalido" }),
        diagnostico: z.string(),
        tratamiento: z.string(),
        medico: z.string()
    }) 
});

export type ICrearPacienteDTO = z.input<typeof crearPacienteSchema>;

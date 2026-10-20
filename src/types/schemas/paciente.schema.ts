import { z } from 'zod';
import { idSchema, ObraSocial, TipoTelefono } from './common.schema';

export const direccionSchema = z.object({
    calle: z.string().default('Sin información'),
    numero: z.string().default('S/N'),
    piso: z.string().optional().default(''),
    departamento: z.string().optional().default(''),
    barrio: z.string().optional().default('Sin información'),
});

export const queryPacientesSchema = z.object({
    query: z.object({
        obraSocial: z.string().optional(),
        dni: z.string().regex(/^[0-9]{7,8}$/).optional(),
    }),
});

export const idPacienteSchema = z.object({ params: z.object({ id: idSchema }) });

export const crearPacienteSchema = z.object({
    body: z.object({
        nombre: z.string().min(2, 'El nombre es obligatorio'),
        dni: z.string().min(7, 'DNI inválido'),
        direccion: direccionSchema,
        email: z.string().email('Email inválido'),
        telefono: z.object({
            tipo: z.enum(TipoTelefono).optional().default(TipoTelefono.CELULAR),
            codigoArea: z.string().default(''),
            numero: z.string().min(7, 'El número de teléfono no es válido'),
        }),
        obraSocial: z.object({
            nombre: z.enum(ObraSocial),
            numeroAfiliado: z.string().optional().default(''),
        }),
        historialMedico: z.object({
            fecha: z.coerce.date({ message: 'Formato de fecha inválido' }),
            diagnostico: z.string().min(1, 'El diagnóstico es obligatorio'),
            tratamiento: z.string().min(1, 'El tratamiento es obligatorio'),
            medico: z.string().min(1, 'El nombre del médico es obligatorio'),
        }),
    }),
});

export const pacienteSchema = z.object({
    nombre: z.string(),
    dni: z.string(),
    direccion: direccionSchema,
    email: z.email(),
    telefono: z.object({
        tipo: z.enum(TipoTelefono),
        codigoArea: z.string(),
        numero: z.string(),
    }),
    obraSocial: z.object({
        nombre: z.enum(ObraSocial),
        numeroAfiliado: z.string(),
    }),
    historialMedico: z.object({
        fecha: z.string(),
        diagnostico: z.string(),
        tratamiento: z.string(),
        medico: z.string(),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
    id: z.string(),
});

export const createPatientFormSchema = crearPacienteSchema.shape.body;

export type ICrearPacienteDTO = z.input<typeof createPatientFormSchema>;
export type ICrearPacienteDTOParsed = z.output<typeof createPatientFormSchema>;
export type IPaciente = z.infer<typeof pacienteSchema>;
export type IQueryPacientes = z.infer<typeof queryPacientesSchema>['query'];

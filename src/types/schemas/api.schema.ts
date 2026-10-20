import { z } from 'zod';
import { EstadoTurno } from './common.schema';

export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) => z.object({
    ok: z.boolean(),
    message: z.string(),
    data: dataSchema,
});

export const apiEnvelopeSchema = apiResponseSchema(z.unknown());

export const userRoleSchema = z.enum(['PACIENTE', 'RECEPCIONISTA', 'ADMIN', 'MEDICO']);

export const sessionPayloadSchema = z.object({
    id: z.string(),
    user: z.string(),
    rol: userRoleSchema,
    activo: z.boolean(),
    exp: z.number().optional(),
});

export const authResultSchema = z.object({
    token: z.string(),
    paciente: z.object({
        id: z.string(),
        dni: z.string(),
        nombre: z.string().optional(),
    }).optional(),
});

export const pacienteResumenSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    dni: z.string(),
    telefono: z.object({
        tipo: z.string().optional(),
        codigoArea: z.string().optional(),
        numero: z.string().optional(),
    }).optional(),
});

export const pacienteDetalleSchema = pacienteResumenSchema.extend({
    email: z.string().optional(),
    direccion: z.object({
        calle: z.string().optional(),
        numero: z.string().optional(),
        barrio: z.string().optional(),
    }).optional(),
    obraSocial: z.object({
        nombre: z.string(),
        numeroAfiliado: z.string().optional(),
    }).optional(),
    historialMedico: z.object({
        fecha: z.string().optional(),
        diagnostico: z.string().optional(),
        tratamiento: z.string().optional(),
        medico: z.string().optional(),
    }).optional(),
});

export const medicoSchema = z.object({
    id: z.string(),
    usuarioId: z.union([
        z.string(),
        z.object({
            id: z.string().optional(),
            _id: z.string().optional(),
            email: z.string().optional(),
        }),
    ]).optional(),
    nombre: z.string(),
    apellido: z.string(),
    matricula: z.string(),
    especialidades: z.array(z.string()),
    telefono: z.string().optional(),
    activo: z.boolean(),
});

export const especialidadSchema = z.object({
    id: z.string(),
    codigo: z.string(),
    nombre: z.string(),
    descripcion: z.string().optional(),
    activo: z.boolean(),
});

export const agendaSchema = z.object({
    id: z.string(),
    medicoId: z.string(),
    diaSemana: z.number(),
    horaInicio: z.string(),
    horaFin: z.string(),
    duracionMinutos: z.number(),
    activo: z.boolean(),
});

export const consultorioSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    piso: z.union([z.number(), z.string()]).optional(),
    especialidad: z.string(),
    activo: z.boolean(),
});

export const turnoSchema = z.object({
    id: z.string(),
    paciente: pacienteDetalleSchema.nullable().optional(),
    medicoId: z.union([medicoSchema, z.string()]).optional(),
    consultorioId: z.union([
        z.object({
            id: z.string().optional(),
            nombre: z.string().optional(),
            piso: z.union([z.string(), z.number()]).optional(),
        }),
        z.string(),
    ]).optional(),
    especialidad: z.string(),
    fechaTurno: z.string(),
    estado: z.enum(EstadoTurno),
    activo: z.boolean().optional(),
    observaciones: z.string().optional(),
});

export const horarioDisponibleSchema = z.object({
    medicoId: z.string(),
    nombreMedico: z.string(),
    fechaHoraInicio: z.string(),
    duracionMinutos: z.number(),
});

export const analisisHistorialSchema = z.object({
    resumenCorto: z.string(),
    gravedad: z.enum(['ALTA', 'MEDIA', 'BAJA']),
    medicamentosMencionados: z.array(z.string()),
});

export type ApiResponse<T> = Omit<z.infer<typeof apiEnvelopeSchema>, 'data'> & { data: T };
export type UserRole = z.infer<typeof userRoleSchema>;
export type SessionPayload = z.infer<typeof sessionPayloadSchema>;
export type AuthResult = z.infer<typeof authResultSchema>;
export type PacienteResumen = z.infer<typeof pacienteResumenSchema>;
export type PacienteDetalle = z.infer<typeof pacienteDetalleSchema>;
export type Medico = z.infer<typeof medicoSchema>;
export type Especialidad = z.infer<typeof especialidadSchema>;
export type Agenda = z.infer<typeof agendaSchema>;
export type Consultorio = z.infer<typeof consultorioSchema>;
export type Turno = z.infer<typeof turnoSchema>;
export type HorarioDisponible = z.infer<typeof horarioDisponibleSchema>;
export type AnalisisHistorial = z.infer<typeof analisisHistorialSchema>;

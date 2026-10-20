import type { z } from 'zod';
import {
    agendaSchema,
    apiEnvelopeSchema,
    analisisHistorialSchema,
    authResultSchema,
    consultorioSchema,
    especialidadSchema,
    horarioDisponibleSchema,
    medicoSchema,
    pacienteDetalleSchema,
    pacienteResumenSchema,
    sessionPayloadSchema,
    turnoSchema,
    userRoleSchema,
} from './schemas/api.schema';
import type { createPatientFormSchema } from './schemas/paciente.schema';

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
export type PacienteNuevoDTO = z.input<typeof createPatientFormSchema>;

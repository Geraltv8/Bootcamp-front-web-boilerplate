import { z } from 'zod';
import { EstadoTurno, idSchema } from './common.schema';

export const CrearTurnoSchema = z.object({
    body: z.object({
        medicoId: idSchema.optional(),
        especialidadId: idSchema,
        fechaHoraInicio: z.iso.datetime({ offset: true, message: 'Debe incluir fecha, hora y zona horaria' }),
    }),
});

export const ActualizarEstadoTurnoSchema = z.object({
    params: z.object({ id: idSchema }),
    body: z.object({
        estado: z.enum([EstadoTurno.ATENDIDO, EstadoTurno.AUSENTE], {
            message: 'El estado debe ser atendido o ausente',
        }),
    }),
});

export const idTurnoSchema = z.object({ params: z.object({ id: idSchema }) });

export const queryDisponibilidadSchema = z.object({
    query: z.object({
        especialidadId: idSchema,
        fecha: z.iso.date(),
        medicoId: idSchema.optional(),
    }),
});

export const queryTurnosSchema = z.object({
    query: z.object({
        fecha: z.iso.date().optional(),
        estado: z.enum(EstadoTurno).optional(),
        medicoId: idSchema.optional(),
        pacienteId: idSchema.optional(),
    }),
});

export const crearCancelacionSchema = z.object({ params: z.object({ id: idSchema }) });
export const createAppointmentFormSchema = CrearTurnoSchema.shape.body;
export const updateAppointmentStateFormSchema = ActualizarEstadoTurnoSchema.shape.body;

export type CrearTurnoDTO = z.infer<typeof createAppointmentFormSchema>;
export type CrearTurnoFormInput = z.input<typeof createAppointmentFormSchema>;
export type IQueryTurnos = z.infer<typeof queryTurnosSchema>['query'];

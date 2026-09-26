import { z } from 'zod';
import { pacienteSchema } from './Paciente.type';

export const turnoSchema = z.object({
	paciente: pacienteSchema.nullish(),
	especialidad: z.string(),
	fechaTurno: z.string(),
	estado: z.enum(['pendiente', 'atendido', 'cancelado']),
	observaciones: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	id: z.string()
});

export type ITurno = z.infer<typeof turnoSchema>;

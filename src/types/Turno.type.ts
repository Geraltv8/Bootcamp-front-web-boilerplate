import { z } from 'zod';
import { pacienteSchema } from './Paciente.type';

export enum Especialidad {
	CARDIOLOGIA = 'cardiologia',
	PEDIATRIA = 'pediatria',
	DERMATOLOGIA = 'dermatologia',
	NEUROLOGIA = 'neurologia'
}

export enum EstadoTurno {
	PENDIENTE = 'pendiente',
	ATENDIDO = 'atendido',
	CANCELADO = 'cancelado'
}

export const turnoSchema = z.object({
	paciente: pacienteSchema.nullable(),
	medicoId: z.string().optional(),
	especialidad: z.enum(Especialidad),
	fechaTurno: z.string(),
	estado: z.enum(EstadoTurno).optional(),
	observaciones: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	id: z.string()
});

export type ITurno = z.infer<typeof turnoSchema>;

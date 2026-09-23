import type { IPaciente } from './Paciente.type';

export interface ITurno {
	paciente: IPaciente;
	especialidad: string;
	fechaTurno: string;
	estado: 'pendiente' | 'atendido' | 'cancelado';
	observaciones: string;
	createdAt: string;
	updatedAt: string;
	id: string;
}

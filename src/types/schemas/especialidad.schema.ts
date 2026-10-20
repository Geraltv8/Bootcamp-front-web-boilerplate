import { z } from 'zod';
import { idSchema } from './common.schema';

export const crearEspecialidadSchema = z.object({
    body: z.object({
        nombre: z.string().trim().min(2).max(80),
        descripcion: z.string().trim().max(250).optional().default(''),
    }),
});

export const actualizarEspecialidadSchema = z.object({
    params: z.object({ id: idSchema }),
    body: z.object({
        nombre: z.string().trim().min(2).max(80).optional(),
        descripcion: z.string().trim().max(250).optional(),
        activo: z.boolean().optional(),
    }).refine((body) => Object.keys(body).length > 0, 'Debe enviar al menos un campo'),
});

export const idEspecialidadSchema = z.object({
    params: z.object({ id: idSchema }),
});

export const queryEspecialidadesSchema = z.object({
    query: z.object({
        incluirInactivas: z.enum(['true', 'false']).optional(),
    }),
});

export const createSpecialtyFormSchema = crearEspecialidadSchema.shape.body;
export const updateSpecialtyFormSchema = actualizarEspecialidadSchema.shape.body;

export type ICrearEspecialidadDTO = z.infer<typeof crearEspecialidadSchema>['body'];
export type IActualizarEspecialidadDTO = z.infer<typeof actualizarEspecialidadSchema>['body'];
export type IQueryEspecialidades = z.infer<typeof queryEspecialidadesSchema>['query'];

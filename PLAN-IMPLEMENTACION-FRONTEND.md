# Plan de implementacion del frontend

## Objetivo y fuentes

Implementar en el frontend los flujos definidos en [Requisitos-Funcionales.md](../Bootcamp-boilerplate/Requisitos-Funcionales.md), consumiendo las rutas y DTOs que existen actualmente en el backend. La implementacion debe respetar al pie de la letra [agent.md](./agent.md). El alcance detallado y las rutas API se describen en [SPEC-FRONTEND.md](./SPEC-FRONTEND.md).

## Reglas de implementacion no negociables

- React 19, Vite 8, TypeScript estricto, React Router DOM, React Bootstrap y SCSS Modules.
- Prohibidos `any`, `@ts-ignore` y `React.FC`; tipar props desestructuradas y eventos DOM.
- Todo formulario usa React Hook Form con `@hookform/resolvers/zod`; errores bajo el campo y `disabled={isSubmitting}` en submit.
- Definir en frontend copias Zod de los esquemas backend separadas por dominio dentro de `src/types/schemas/`. Mantener exactamente iguales sus campos, restricciones, transformaciones, defaults y mensajes; al cambiar un DTO backend, sincronizar su copia y validar tipos/build.
- Las llamadas de red se encapsulan en custom hooks tipados y usan la instancia global `clientesAxios`. No usar `fetch` ni peticiones Axios desde componentes de UI.
- Confiar en interceptores Axios para JWT y 401; no inyectar tokens desde componentes.
- Las lecturas muestran Skeletons de React Bootstrap. Las acciones y fallos muestran `toast.success`/`toast.error` de `sonner`.
- Ante errores de servidor/red, preservar los valores ingresados; no dar feedback de exito ni alterar datos como si la mutacion hubiera funcionado.

## Fases

### Fase 0 — Alinear e integrar contratos

1. Copiar los esquemas de agenda, especialidad, medico, paciente, autenticacion, turnos y recepcion desde los DTOs backend a archivos independientes en `src/types/schemas/`, conservando las validaciones Zod y sus mensajes. El frontend no importa codigo fuente del backend.
2. Definir esquemas Zod para las respuestas API y los modelos de Paciente, Medico, Especialidad, Agenda, Consultorio, Turno y HorarioDisponible; `src/types/Api.type.ts` deriva los tipos mediante `z.infer`.
3. Mantener pendiente la asignacion de consultorio a turnos ciudadanos: `POST /turnos` no acepta `consultorioId`, por lo que se muestra el consultorio solo si el backend lo devuelve.
4. Enviar el instante ISO de disponibilidad al reservar; el frontend no reconstruye horarios desde horas locales.

**Estado:** implementada con esquemas Zod duplicados en el frontend, sin dependencia de la ubicacion del repositorio backend.

### Fase 1 — Acceso, sesion y rutas por rol

1. Separar las pantallas de acceso ciudadano (DNI/telefono) y personal (email/contraseña). Contratos existentes: `POST /auth/ciudadano-login` y `POST /auth/login`.
2. Persistir el token solo tras una respuesta exitosa; recuperar el rol de la sesion usando el mecanismo de autenticacion ya definido en el proyecto/backend. No confiar en el control visual como autorizacion de API.
3. Redirigir por rol: PACIENTE al portal ciudadano; RECEPCIONISTA al dashboard; ADMIN a administracion o al dashboard administrativo.
4. Manejar errores de validacion/autenticacion con el contrato estandar y `sonner`; mantener el interceptor global para 401.
5. Reemplazar/mejorar hooks de red existentes para representar `data`, `isLoading` y `error` de forma explicita, usar `unknown` para errores y evitar respuestas silenciosas.

**Salida:** ambos tipos de login funcionales y las rutas privadas guiadas por rol.

**Estado:** implementada en `Login.tsx`, `auth/session.ts`, `App.tsx` y `NavbarPrincipal.tsx`. El rol decodificado del JWT se usa solo para UX y no sustituye la autorizacion backend.

### Fase 2 — Panel de recepcion

1. Dashboard diario con `GET /turnos?fecha=YYYY-MM-DD`, orden cronologico del backend y Skeleton durante carga. Aplicar filtros adicionales solo con query params soportados; distinguir turnos CANCELADO/inactivos porque el listado general no los filtra por `activo`.
2. Acciones ATENDIDO/AUSENTE mediante `PATCH /turnos/:id/estado` con `{ estado }`; tras exito refrescar o actualizar el turno, ante error mantener el estado anterior.
3. Busqueda segura de paciente por DNI mediante `GET /recepcion/pacientes?dni=...`; tratar 404 como paciente no encontrado, no como error irrecuperable.
4. Para paciente encontrado, reservar con `POST /recepcion/turnos` usando DNI, especialidad, fechaHoraInicio y medico/consultorio opcionales.
5. Para paciente nuevo, permitir el alta con `POST /pacientes` conforme al esquema backend antes de reservar; conservar el formulario y evitar reenvios dobles.

**Salida:** operacion diaria sobre turnos existentes y asignacion presencial integrada sin descargar el padron completo.

**Estado:** implementada en el dashboard, el flujo de busqueda/asignacion y el alta de paciente. Las busquedas 404 se presentan como paciente no encontrado; los cambios de endpoint limpian resultados anteriores para evitar asociar un DNI a datos obsoletos.

### Fase 3 — Portal ciudadano mobile-first

1. Implementar wizard: especialidad -> profesional opcional -> fecha -> horario -> confirmacion.
2. Cargar especialidades activas desde `GET /especialidades` y profesionales desde `GET /medicos`; ambos requieren JWT y permiten PACIENTE.
3. Consultar horarios en `GET /turnos/disponibilidad?especialidadId=...&fecha=YYYY-MM-DD&medicoId=...`; el backend genera solo horarios futuros libres dentro de los proximos 30 dias.
4. Reservar con `POST /turnos` usando `{ especialidadId, medicoId?, fechaHoraInicio }`. La UI ofrece feedback al 409 (slot ocupado, limite de dos pendientes o datos que ya no cumplen regla) y permite reintentar seleccionando otro horario.
5. Mostrar “Mis turnos” desde `GET /turnos/me`, sin sustituirlo por una consulta general.
6. Cancelar mediante `PATCH /turnos/:id/cancelacion` sin body. Ocultar/deshabilitar la accion cuando falten menos de dos horas y manejar 409 del backend como rechazo definitivo.
7. Acordar con backend como cumplir el detalle de consultorio requerido por RF-5.3; el endpoint ciudadano de reserva no recibe actualmente ese dato.

**Salida:** recorrido de reserva y gestion de turnos propios basado en disponibilidad y validaciones autoritativas del backend.

**Estado:** implementada en el portal de ciudadano y el wizard de reserva, incluyendo cancelacion condicionada por la ventana backend. La UI indica “A confirmar” cuando no llega consultorio.

### Fase 4 — Administracion de medicos, especialidades y agendas

1. CRUD de medicos con `GET/POST/PATCH/DELETE /medicos` y `GET /medicos/:id`; filtros soportados: `especialidad`, `activo`, `busqueda`. Para dar de alta un medico, ADMIN crea primero la cuenta con `POST /auth/register` y rol MEDICO, y luego el perfil con `POST /medicos`; contemplar el fallo parcial porque el backend no agrupa ambas acciones en transaccion. PATCH de MEDICO se limita al propio telefono. Mostrar conflictos y validaciones sin borrar datos del formulario.
2. CRUD de especialidades con `GET/GET :id/POST/PATCH/DELETE /especialidades`. La lista general requiere token; el rol PACIENTE puede listar para reservar, mientras las mutaciones son solo ADMIN.
3. Gestionar agendas por medico:
   - Listar: `GET /medicos/:medicoId/agendas`; permite ADMIN/RECEPCIONISTA.
   - Crear: `POST /medicos/:medicoId/agendas`; solo ADMIN.
   - Editar: `PATCH /agendas/:id`; solo ADMIN.
   - Baja logica: `DELETE /agendas/:id`; solo ADMIN.
4. Usar diaSemana numerico 0-6 (domingo=0), hora `HH:mm` y duracion en minutos. Mostrar 400 para bloque incoherente y 409 para solapamiento.
5. Refrescar catalogos tras mutaciones y no ofrecer medicos/especialidades inactivos en flujos de reserva.

**Salida:** administracion conectada a los CRUDs implementados y con respuestas de conflicto visibles.

**Estado:** implementada en el panel administrativo y la pagina de agendas. Recepcion puede consultar agendas, pero las acciones de creacion, edicion y baja se muestran solo a ADMIN, acorde a los permisos backend.

### Fase 5 — Verificacion integrada y calidad

1. Ejecutar lint, build de produccion y `tsc --noEmit`; estos tres comandos pasan.
2. Revisar las rutas y permisos por rol, estados de carga Skeleton y feedback de errores/mutaciones.
3. Pendiente validar con backend ejecutandose los casos HTTP 400/401/403/404/409, slots agotados, errores de red, navegacion completa responsive y accesibilidad con teclado.

## Dependencias y riesgos vigentes

- El backend ya expone autenticacion diferenciada, catalogo, agendas, disponibilidad, reservas de ciudadano, turnos propios, cancelacion y operaciones de recepcion. No volver a tratar estas capacidades como APIs pendientes.
- Los esquemas frontend y backend son copias independientes; cuando se modifique un DTO backend, actualizar en el mismo cambio su esquema Zod correspondiente en `src/types/schemas/` para evitar divergencias.
- RF-5.3 requiere consultorio en el detalle del turno, pero la reserva ciudadana no asigna ni recibe consultorio en su DTO. Definir asignacion backend antes de prometer ese dato.
- `GET /turnos/disponibilidad` no requiere autenticacion segun la ruta actual; no enviar JWT manualmente y consumir solo los campos necesarios.
- El build informa un chunk JavaScript mayor a 500 kB; no impide compilar, pero conviene revisar code splitting como trabajo separado.
- Se preservaron las modificaciones preexistentes en `agent.md` y `src/components/turnos/GeneradorResumenIA.tsx`.

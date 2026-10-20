# Especificacion funcional del frontend

## 1. Objetivo y referencias

El frontend debe implementar los requisitos en [Requisitos-Funcionales.md](../Bootcamp-boilerplate/Requisitos-Funcionales.md) usando estrictamente las reglas de [agent.md](./agent.md). Esta especificacion se actualizo contra las rutas, controladores y esquemas que actualmente existen en el backend.

Experiencias:

1. Acceso de ciudadano y personal.
2. Portal ciudadano mobile-first para reservar y consultar sus turnos.
3. Panel desktop de recepcion.
4. Panel de administracion de medicos, especialidades y agendas.

## 2. Roles y navegacion

| Rol backend | Area inicial | Capacidades principales |
|---|---|---|
| `PACIENTE` (ciudadano) | Portal ciudadano / Mis turnos | Reservar, consultar sus propios turnos y cancelar en el plazo permitido. Puede leer especialidades y medicos. |
| `RECEPCIONISTA` | Dashboard diario | Consultar turnos, cambiar a ATENDIDO/AUSENTE, buscar pacientes por DNI, registrar un turno y consultar agendas. |
| `ADMIN` | Administracion | CRUD de medicos/especialidades/agendas y acciones administrativas sobre turnos, pacientes y usuarios permitidas por backend. |
| `MEDICO` | Sin flujo funcional definido | El backend permite leer medicos y actualizar mediante PATCH; no se define una experiencia de producto para este rol en los requisitos actuales. |

Rutas implementadas:

- `/login`, `/login/ciudadano`, `/login/personal`
- `/ciudadano/turnos`, `/ciudadano/reservar`
- `/recepcion`, `/recepcion/turnos/nuevo`
- `/nuevo-paciente`, `/turno-detalle/:id`
- `/admin` (pestañas de médicos y especialidades), `/admin/agendas/:medicoId`

La pantalla de agendas es de solo lectura para RECEPCIONISTA; crear, editar y dar de baja se muestra solo a ADMIN.

El cliente puede ocultar rutas/acciones por rol para UX, pero la API es la autoridad. Todas las rutas privadas se conectan a la autenticacion existente; los 401 son manejados por el interceptor Axios.

## 3. Flujos funcionales

### 3.1 Autenticacion

- Personal: `POST /api/v1/auth/login` con `{ email, password }`. El backend valida ambos campos; `user` ya no es requerido. Exito devuelve token en `data.token`.
- Ciudadano: `POST /api/v1/auth/ciudadano-login` con `{ dni, telefono }`. DNI: 7 u 8 digitos; telefono: cadena con 7-15 digitos despues de normalizar. Si no existe, el backend crea el paciente usando DNI/telefono y emite JWT de rol PACIENTE.
- En ambos casos solo guardar sesion tras exito y redirigir segun rol. Mostrar errores de campo con RHF/Zod y errores de autenticacion/red con `toast.error`.
- El token se gestiona a traves del almacenamiento/interceptores del proyecto; componentes no agregan `Authorization` manualmente.
- `GET /api/v1/pacientes/me` devuelve el perfil autenticado del paciente (`data`) y requiere rol PACIENTE.

### 3.2 Reserva ciudadana

Wizard secuencial obligatorio:

1. Especialidad activa.
2. Profesional opcional.
3. Fecha.
4. Horario disponible.
5. Confirmacion y reserva.

Comportamiento:

- Cargar catalogo desde `GET /api/v1/especialidades` (requiere JWT; permite PACIENTE, RECEPCIONISTA y ADMIN). La respuesta lista especialidades activas, ordenadas por nombre.
- Cargar profesionales desde `GET /api/v1/medicos` (requiere JWT; permite PACIENTE, RECEPCIONISTA, ADMIN y MEDICO). El filtro opcional `especialidad` espera codigo/texto normalizado; `activo=true|false` y `busqueda` tambien estan soportados. Para PACIENTE, el backend fuerza `activo=true`.
- Consultar disponibilidad con `GET /api/v1/turnos/disponibilidad?especialidadId=<id>&fecha=YYYY-MM-DD&medicoId=<id-opcional>`. La ruta actual no requiere JWT.
- Mostrar cada opcion usando `medicoId`, `nombreMedico`, `fechaHoraInicio` y `duracionMinutos`. `fechaHoraInicio` se recibe como fecha ISO serializada; al reservar enviar ese instante con offset, sin regenerar la hora a partir de un valor local.
- El backend rechaza fechas anteriores/hoy ya pasadas y fechas posteriores a 30 dias; slots ocupados o agendas sin disponibilidad no se deben inventar ni calcular en cliente.
- El boton de confirmacion llama `POST /api/v1/turnos` con `{ especialidadId, fechaHoraInicio, medicoId? }`; se requiere sesion PACIENTE. El backend comprueba agenda, horario disponible, limite de dos turnos pendientes por especialidad y concurrencia usando transaccion. El nuevo turno nace PENDIENTE.
- Mostrar Skeleton de React Bootstrap durante lectura y bloquear submit con `isSubmitting`. Un 409 conserva el contexto y permite volver a elegir slot.

### 3.3 Mis turnos y cancelacion

- La primera pantalla de PACIENTE carga `GET /api/v1/turnos/me` (JWT y rol PACIENTE). El backend devuelve turnos activos, PENDIENTES y futuros en orden cronologico, incluyendo datos populados de medico y consultorio cuando existan.
- La accion de cancelar se ofrece si faltan dos horas o mas; para cancelar enviar `PATCH /api/v1/turnos/:id/cancelacion` sin body.
- Backend valida propiedad, estado PENDIENTE y la ventana de dos horas para PACIENTE; al exito cambia a CANCELADO e inactivo. Error 409 significa que ya no se puede cancelar.
- No utilizar `DELETE /turnos/:id` en el flujo ciudadano: es una ruta ADMIN.
- **Dato pendiente:** la reserva de ciudadano no incluye `consultorioId`, y `crearReserva` solo agrega el consultorio si recibe uno. El frontend debe mostrar el consultorio cuando venga poblado, pero no puede garantizarlo hasta acordar una asignacion del backend.

### 3.4 Recepcion

- Cargar `GET /api/v1/turnos?fecha=YYYY-MM-DD`. La consulta acepta `fecha`, `estado`, `medicoId` y `pacienteId`; si no se envia fecha, ADMIN/RECEPCIONISTA usan hoy. La respuesta esta ordenada por `fechaTurno` y popula paciente, medico y consultorio. El controlador no filtra por `activo`, por lo que la vista debe distinguir estados CANCELADO y registros inactivos si aparecen.
- Para PACIENTE, el listado general queda restringido por el backend al paciente del token; el panel “Mis turnos” debe seguir usando `/me`.
- Cambiar estado con `PATCH /api/v1/turnos/:id/estado` y `{ estado: "atendido" | "ausente" }`. Solo ADMIN/RECEPCIONISTA; backend solo cambia un turno activo que siga PENDIENTE.
- Buscar persona con `GET /api/v1/recepcion/pacientes?dni=<7-8-digitos>`. Requiere ADMIN/RECEPCIONISTA. Un 404 identifica paciente inexistente.
- Registrar turno para paciente existente con `POST /api/v1/recepcion/turnos` y `{ dni, especialidadId, fechaHoraInicio, medicoId?, consultorioId? }`. El backend obtiene paciente por DNI y pasa por la misma transaccion/reglas de reserva.
- Para crear el perfil de un paciente nuevo, la API disponible es `POST /api/v1/pacientes` (ADMIN/RECEPCIONISTA). El body sigue el esquema completo de paciente; luego se reserva el turno con el DNI. Mostrar conflictos de DNI y mantener el formulario si el alta o la reserva falla.

### 3.5 Administracion

#### Medicos

- Rutas: `GET /api/v1/medicos`, `GET /api/v1/medicos/:id`, `POST /api/v1/medicos`, `PATCH /api/v1/medicos/:id`, `DELETE /api/v1/medicos/:id`.
- Todas requieren JWT. Listar/detalle admite RECEPCIONISTA, ADMIN, MEDICO y PACIENTE; crear/eliminar es ADMIN; PATCH permite ADMIN o MEDICO. Para MEDICO, el controlador limita la actualizacion al propio telefono.
- Filtros: `especialidad`, `activo=true|false`, `busqueda`.
- Alta requiere `usuarioId`, `nombre`, `apellido`, `matricula` alfanumerica, `especialidades` (una o mas) y `telefono`. ADMIN primero puede crear la cuenta con `POST /api/v1/auth/register` (`rol: "MEDICO"`) y luego crear el perfil del medico; las dos operaciones no forman una transaccion. La actualizacion acepta campos parciales. La baja es logica y responde 400 si hay turnos pendientes futuros; no se debe mostrar medico inactivo para reservar.
- Mostrar conflictos de matricula y validaciones devueltos por backend; no inventar una ruta administrativa para crear cuenta de usuario sin revisar `/auth/register`.

#### Especialidades

- Rutas: `GET /api/v1/especialidades`, `GET /api/v1/especialidades/:id`, `POST /api/v1/especialidades`, `PATCH /api/v1/especialidades/:id`, `DELETE /api/v1/especialidades/:id`.
- Listar requiere JWT y permite PACIENTE/RECEPCIONISTA/ADMIN; el query `incluirInactivas=true` solo tiene efecto para ADMIN.
- Detalle y mutaciones son ADMIN. Crear recibe `{ nombre, descripcion? }`; el backend deriva `codigo`. PATCH acepta `nombre`, `descripcion` y/o `activo`. DELETE aplica baja logica.
- Duplicados y baja bloqueada por medicos activos o turnos pendientes futuros responden 409.

#### Agendas

- El backend monta estas rutas en `/api/v1`:
  - `GET /medicos/:medicoId/agendas` — ADMIN/RECEPCIONISTA; query opcional `incluirInactivas=true|false` (inactivas solo visibles para ADMIN).
  - `POST /medicos/:medicoId/agendas` — solo ADMIN.
  - `PATCH /agendas/:id` — solo ADMIN.
  - `DELETE /agendas/:id` — solo ADMIN, baja logica.
- Alta requiere `{ diaSemana, horaInicio, horaFin, duracionMinutos }`; `diaSemana` es 0-6 con domingo=0 y horas `HH:mm`. Inicio debe preceder al fin y la duracion debe caber en el bloque.
- PATCH acepta cualquiera de esos campos y `activo`, pero debe incluir al menos uno. Error 400: bloque incoherente; 409: solapamiento con agenda activa del mismo medico/dia.
- La disponibilidad ciudadana se calcula en backend a partir de agendas activas; el panel de agendas no replica ese calculo.

## 4. Contratos API observados

Base `/api/v1`; las respuestas siguen el formato backend `respuestaEstandar(res, status, ok, message, data)`. Leer mensajes desde `message`, no asumir `mensaje`.

| Capacidad | Endpoint, permisos y contrato | Nota UI |
|---|---|---|
| Login personal | `POST /auth/login`, `{ email, password }`; publico; respuesta `data.token`. | Ya no pide `user`. |
| Login ciudadano | `POST /auth/ciudadano-login`, `{ dni, telefono }`; publico; responde `data.token` y `data.paciente`. | Puede crear perfil minimo cuando no existe. |
| Perfil propio | `GET /pacientes/me`; PACIENTE. | Datos privados solo para la sesion propia. |
| Especialidades | GET autenticado para PACIENTE/RECEPCIONISTA/ADMIN; CRUD ADMIN. | Listado activo por defecto. |
| Medicos | GET/listado y detalle para roles autenticados incluyendo PACIENTE; alta/baja ADMIN; PATCH ADMIN/MEDICO. | Consultar filtros backend. |
| Agendas | lectura ADMIN/RECEPCIONISTA; mutaciones ADMIN. | Manejadas por medicoId y agendaId. |
| Disponibilidad | `GET /turnos/disponibilidad` sin JWT, query `especialidadId`, `fecha`, `medicoId?`. | Respuesta de slots calculados por backend. |
| Reserva ciudadano | `POST /turnos`, PACIENTE; body `especialidadId`, `fechaHoraInicio` ISO con offset y `medicoId?`. | Crea PENDIENTE y verifica concurrencia/reglas en transaccion; conflictos se reportan 409. |
| Mis turnos | `GET /turnos/me`; PACIENTE. | Proximos pendientes, activos y ordenados. |
| Cancelar turno propio | `PATCH /turnos/:id/cancelacion`, PACIENTE/RECEPCIONISTA/ADMIN; solo params, sin body. | Para PACIENTE verifica titularidad y limite 2h; personal puede cancelar pendientes sin esa restriccion temporal. |
| Listado general de turnos | `GET /turnos`, JWT; query `fecha`, `estado`, `medicoId`, `pacienteId`. | ADMIN/RECEPCIONISTA usa hoy si no hay fecha; PACIENTE se restringe a su identidad. |
| Estado de recepcion | `PATCH /turnos/:id/estado`, ADMIN/RECEPCIONISTA; `{ estado: "atendido" | "ausente" }`. | Solo turno PENDIENTE activo. |
| Buscar paciente por DNI | `GET /recepcion/pacientes?dni=...`, ADMIN/RECEPCIONISTA. | Devuelve solo nombre, DNI y telefono; 404 si no existe. |
| Turno presencial | `POST /recepcion/turnos`, ADMIN/RECEPCIONISTA; `{ dni, especialidadId, fechaHoraInicio, medicoId?, consultorioId? }`. | Requiere paciente activo ya creado. |
| Alta de paciente | `POST /pacientes`, ADMIN/RECEPCIONISTA. | Usa esquema amplio; no es equivalente al registro minimo por login ciudadano. |

Errores principales: 400 validacion/fecha, 401 sesion o credenciales, 403 rol, 404 recurso no encontrado, 409 conflicto de negocio/slot/cancelacion. Mostrar `message` al usuario y conservar inputs.

## 5. Restricciones de arquitectura y UX

### Formularios y Zod

- Usar RHF en todos los formularios medianos/grandes y `zodResolver` con las copias locales de los esquemas Zod backend.
- Los esquemas backend incluyen la forma de request HTTP; el frontend mantiene copias Zod equivalentes separadas por dominio en `src/types/schemas/`, sin importar codigo del backend. Al cambiar una regla backend, sincronizar su copia incluyendo mensajes, defaults, transformaciones y refinamientos.
- Mostrar `formState.errors` bajo sus controles; no borrar valores en errores de red o validacion.
- Deshabilitar submit con `isSubmitting`; evitar dobles envios.

### Consumo HTTP y estados

- Centralizar peticiones en custom hooks tipados que usan `clientesAxios`; no llamar `fetch` ni `axios` desde paginas/componentes.
- Mantener cada responsabilidad HTTP en su modulo: `useApiQuery.ts` para lecturas, `useApiMutation.ts` para mutaciones y `getApiErrorMessage.ts` para traducir errores. El hook legado sin consumidores se elimina.
- El interceptor pone JWT y gestiona 401. La disponibilidad publica no requiere token y no debe cambiar el flujo de sesion.
- Lecturas con Skeletons React Bootstrap. Mutaciones con feedback `sonner`; reflejar exito solo tras respuesta exitosa.
- Errores capturados como `unknown` y traducidos desde la respuesta estandar.

### Componentes, layout y accesibilidad

- Respetar React 19, Vite 8, TypeScript estricto, React Router DOM, React Bootstrap y SCSS Modules.
- Componentes funcionales con props desestructuradas y tipos explicitos; eventos DOM tipados.
- Ciudadano mobile-first; recepcion/administracion desktop responsive.
- Etiquetas asociadas, errores accesibles, foco visible y navegacion completa por teclado.

## 6. Correspondencia con requisitos funcionales

| Requisitos | Estado backend | Implementacion frontend |
|---|---|---|
| RF-1.1–1.4 | Login de PACIENTE y personal disponible. | Implementado: login separado por modalidad, sesion tras exito y rutas privadas guiadas por rol. |
| RF-2.1–2.4 | CRUD de especialidades y medicos con permisos y baja logica. | Implementado en `/admin`, con alta secuencial de cuenta/perfil, edicion, baja y manejo de errores. |
| RF-3.1–3.4 | CRUD de agendas y consulta de disponibilidad. | Implementado en `/admin/agendas/:medicoId`; ADMIN modifica y RECEPCIONISTA solo consulta. |
| RF-4.1–4.4 | Transiciones, ventana de reserva, limite por especialidad y transaccion. | Implementado mediante dashboard de recepcion y wizard ciudadano; reglas de negocio siguen siendo autoritativas en backend. |
| RF-4.5 | Cancelacion propia con ventana de dos horas. | Implementado desde Mis turnos; se bloquea la accion fuera de ventana y se presenta el rechazo del backend. |
| RF-4.6 | Consulta diaria y acciones de recepcion. | Implementado con filtro por fecha, estados y acciones ATENDIDO/AUSENTE. |
| RF-5.1–5.2 | Reserva, turnos propios y disponibilidad. | Implementado con flujo mobile-first, Skeletons y notificaciones. |
| RF-5.3 | `/turnos/me` puede devolver consultorio, pero reserva ciudadana no lo asigna en todos los casos. | Se muestra el consultorio si existe; si no, se presenta “A confirmar”. No se inventa asignacion en el cliente. |
| RF-6.1–6.3 | Turnos de recepcion, busqueda DNI y alta de paciente disponibles. | Implementado: dashboard diario, busqueda por DNI, alta de paciente y asignacion presencial. |

## 7. Criterios de aceptacion

1. Login personal envia solo email/contraseña; login ciudadano envia DNI/telefono y ambos guardan token solo tras exito.
2. Ciudadano inicia en Mis turnos, puede reservar recorriendo el wizard y recibe solo horarios que devuelve disponibilidad.
3. Un horario ya reservado, fecha no permitida o limite excedido produce feedback claro sin falsa confirmacion.
4. Cancelar esta disponible solo dentro de la regla temporal y backend rechaza titularidad/estado/tiempo invalidos.
5. Recepcion carga turnos del dia en orden, puede buscar por DNI, crear paciente si corresponde, reservar y marcar ATENDIDO/AUSENTE.
6. ADMIN puede administrar medicos, especialidades y agendas; errores 400/409 se muestran sin perder lo escrito.
7. Las lecturas tienen Skeletons y las acciones usan notificaciones `sonner`.
8. Formularios nuevos usan esquemas Zod locales sincronizados con backend, RHF y `isSubmitting`; toda red usa hooks y `clientesAxios`.
9. TypeScript estricto compila; codigo nuevo sin `any`, `@ts-ignore`, `React.FC` ni `fetch` nativo.
10. En Mis turnos se muestra consultorio cuando el backend lo asigna; la UI no inventa una asignacion.

## 8. Implementacion y verificaciones

- Formularios usan copias locales Zod separadas por dominio en `src/types/schemas/`; no hay imports de codigo fuente backend en el bundle ni en la configuracion de Vite.
- `Api.type.ts` deriva sus tipos desde esquemas Zod de respuesta definidos en `types/schemas/api.schema.ts`; los componentes y hooks consumen esos tipos derivados.
- No mantener aliases `Paciente.type.ts` ni `Turno.type.ts`: los tipos usados se importan de los esquemas de dominio y los modelos de respuesta de `Api.type.ts`.
- Las paginas de reserva, recepcion, agenda y administracion son wrappers de flujos/componentes dedicados. Los pasos del wizard, formularios/listas de agenda, secciones administrativas, acceso y busqueda/asignacion de recepcion estan separados en archivos propios bajo `src/components/`.
- El mantenimiento de medicos separa alta de cuenta, edicion/alta de perfil y listado en `DoctorAccountForm.tsx`, `DoctorProfileForm.tsx` y `DoctorsList.tsx`.
- Las llamadas de lectura y mutacion usan `useApiQuery`/`useApiMutation` y la instancia `clientesAxios`. Al cambiar una URL de consulta se limpia el resultado previo; un 404 de busqueda se representa como estado de no encontrado, no como error global.
- Verificados: `npm run lint`, `npm run build` y `npx tsc --noEmit`.
- No verificados aun: pruebas end-to-end contra servidor backend activo, respuestas de error reales y prueba manual de accesibilidad/responsive.
- La duplicacion evita acoplar el build a la ubicacion del backend; la sincronizacion entre las dos copias Zod debe incluirse en los cambios de DTOs backend.
- El build termina correctamente con una advertencia de chunk principal superior a 500 kB; code splitting queda como optimizacion pendiente.

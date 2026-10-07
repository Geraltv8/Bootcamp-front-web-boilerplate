# Reglas de arquitectura y estilo

## Stack Tecnologico
- React 19 + Vite 8.
- TypeScript estricto.
- React Router DOM.
- React Boostrap (Para el diseño base) + SCSS Modules (estilos personalizados).

## Tipado y Componentes
- **PROHIBIDO** el uso de `any` y `@ts-ignore`
- **PROHIBIDO** el uso de `React.FC`. los componentes funcionales deben tipar sus argumentos (props) directamente deconstruyendo el objeto: `const MiComponente = ({ prop1, prop2 }: MiComponenteProps) => {....}`
- Los eventos del DOM deben estar tipados estrictamente (ej `React.ChangeEvent<HTMLInputElement>`).

## Formularios y Validación (Código Isomórfico)
- **PROHIBIDO** el uso de componentes controlados (múltiples `useState` y `onChange`) para formularios medianos o grandes.
- **Obligatorio:** Todo formulario debe construirse utilizando `react-hook-form` (RHF).
- **Validación:** RHF debe estar acoplado a `@hookform/resolvers/zod`. Se deben reutilizar los mismos esquemas de Zod creados en el Backend para garantizar una única fuente de verdad.
- Los errores de validación de Zod deben mostrarse visualmente debajo de los inputs correspondientes usando el objeto `errors` de RHF.

## Consumo de APIs y Red
- **Cliente HTTP:** Todas las peticiones deben hacerse mediante la instancia global de `axios` (ej. `clientesAxios`). NUNCA usar `fetch` nativo.
- **Seguridad:** Confía en los Interceptores de Axios ya configurados para inyectar el JWT (`Authorization: Bearer`) y para manejar cierres de sesión automáticos (Error 401). No inyectes el token manualmente en los componentes.
- **Custom Hooks:** Toda llamada a la API debe encapsularse en Custom Hooks tipados con Genéricos (ej. `useFetch<ITurno[]>`). No realizar peticiones `axios.get` sueltas dentro de `useEffect` en los componentes de UI.

## Experiencia de Usuario (UX) y UI
- **Estados Asíncronos:** Toda petición a la red debe tener un manejo de estado explícito. Utiliza `Skeletons` de React Bootstrap para estados de carga (`isLoading`), nunca dejes la pantalla en blanco.
- **Feedback:** Utiliza la librería `sonner` (`toast.success`, `toast.error`) para dar notificaciones no intrusivas sobre el resultado de las acciones (ej. "Turno creado", "Error de red").
- **Bloqueo:** Los botones de "Submit" deben usar la propiedad `disabled={isSubmitting}` de React Hook Form para evitar dobles envíos.
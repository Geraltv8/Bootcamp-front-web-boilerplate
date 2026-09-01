export const validarDatos = (datos, reglas) => {
    let errores = {};

    for (let campo in reglas) {

        const mensajeError = reglas[campo](datos[campo]);

        if (mensajeError) {
            errores[campo] = mensajeError;
        }
    }

    return errores;

};


//EJEMPLOS DE LOCAL STORAGE
//Guardar
localStorage.setItem('key', 'value');

//recuperar
const miDato = localStorage.getItem('key');

//borrar dato
localStorage.removeItem('key');


//BACKEND (endpoint) Crear una ruta POST /api/auth/login
//admin@salita.com y la contraseña: 1234
//responder un JSON {ok:true, token: "token_falso_123"} si no error 401

//Frontend Crear un LOgin.jsx formulario con email y contraseña y un boton
//Agregar a las rutas, y que el login mueva a dashboard y guarde el token en LocalStorage
export interface IPaciente {
    direccion: {
        calle: string;
        numero: string;
        piso: string;
        departamento: string;
        barrio: string;
    };
    telefono: {
        tipo: string;
        codigoArea: string;
        numero: string;
    };
    obraSocial: {
        nombre: string;
        numeroAfiliado: string;
    };
    historialMedico: {
        fecha: string;
        diagnostico: string;
        tratamiento: string;
        medico: string;
    };
    nombre: string;
    dni: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

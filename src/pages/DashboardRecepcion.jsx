import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { Container, Row } from "react-bootstrap";
import { toast } from 'sonner';
import clientesAxios from "../config/axios";

import BuscadorTurnos from "../components/turnos/BuscadorTurnos";
import TurnoCard from "../components/turnos/TurnoCard";
import TurnoCardSkeleton from "../components/turnos/TurnoCardSkeleton";

const DashboardRecepcion = () => {
    const [busqueda, setBusqueda] = useState("");
    const { data: turnos, setData: setTurnos, isLoading } = useFetch('/turnos');

    const turnosFiltrados = turnos.filter(turno =>
        turno.paciente.nombre.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
    );

    const marcarComoAtendido = async (idTurno) => {
        try {
            await clientesAxios.patch(`/turnos/${idTurno}`);

            const turnosActualizados = turnos.map(turno => {
                if (turno.id === idTurno) return { ...turno, estado: "atendido"};
                return turno;
            });
            setTurnos(turnosActualizados);

        } catch (error) {
            console.error(error);
            toast.error("Error de red.");
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Turnos del Día</h2>

            <BuscadorTurnos valor={busqueda} alCambiar={setBusqueda} />

            <Row>
                {isLoading ? (
                    [1, 2, 3, 4].map(item => <TurnoCardSkeleton key={item} />) 
                 ) : turnos.length === 0 ? (
                    <p>No se encontraron turnos pendientes.</p>
                ) : 
                turnosFiltrados.map((turno) => (
                    <TurnoCard
                        key={turno.id}
                        turno={turno}
                        onAtender={marcarComoAtendido}
                    />
                ))}
            </Row>
        </Container>
    );
};

export default DashboardRecepcion;
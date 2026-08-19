import { useState, useEffect } from "react";
import { Container, Badge, Row, Col, Card, Button } from "react-bootstrap";
import clientesAxios from "../config/axios";

const DashboardRecepcion = () => {
    const [busqueda, setBusqueda] = useState("");
    const [turnos, setTurnos] = useState([]);

    const turnosFiltrados = turnos.filter(turno =>
        turno.paciente.nombre.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
    );

    useEffect(() => {
    
        const obtenerTurnosDelBackend = async () => {
            try {

                const respuesta = await clientesAxios.get('/turnos');

                setTurnos(respuesta.data.data);

            } catch (error) {
                console.error("hubo un error al sincronizar", error);
            }
        };

        obtenerTurnosDelBackend();

    }, []);

    const marcarComoAtendido = (idTurno) => {
        const turnosActualizados = turnos.map(turno => {
            if (turno.id === idTurno) return { ...turno, estado: "Atendido"};
            return turno;
        });
        setTurnos(turnosActualizados);
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Turnos del Día</h2>
            <Row className="mb-4">
                <Col md={6}>
                    <input 
                        type="text"
                        className="form-control"
                        placeholder="Buscar Paciente..."
                        value={busqueda}
                        onChange={(evento) => setBusqueda(evento.target.value)}
                    />
                </Col>    
            </Row>

            <Row>
                {turnos.length === 0 ? (
                    
                        <p>Cargando turnos del servidor...</p>
                    
                ) : 
                turnosFiltrados.map((turno) => (
                    <Col md={4} key={turno.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{turno.paciente.nombre}</Card.Title>
                                <h5>{turno.paciente.dni}</h5>
                                <Card>
                                     <h5>{turno.fechaTurno}</h5>
                                     <h5>{turno.observaciones}</h5>
                                </Card>
                               
                                <h5 className="mt-3">
                                    {turno.estado === 'Atendido' 
                                        ? <Badge bg="success">Atendido</Badge> 
                                        : <Badge bg="warning" text="dark"> En Espera</Badge>
                                    }
                                </h5>
                                <Button onClick={() => marcarComoAtendido(turno.id)} disabled={turno.estado === 'Atendido'}>Llamar</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default DashboardRecepcion;
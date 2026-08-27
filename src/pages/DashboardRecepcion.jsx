import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { Container, Badge, Row, Col, Card, Button, Placeholder } from "react-bootstrap";
import { toast } from 'sonner';
import clientesAxios from "../config/axios";

const DashboardRecepcion = () => {
    const [busqueda, setBusqueda] = useState("");

    const turnosFiltrados = turnos.filter(turno =>
        turno.paciente.nombre.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
    );

   const { data: turnos, setData: setTurnos, isLoading } = useFetch('/turnos');

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

            <Row>
                {isLoading ? (
                    [1, 2, 3].map((fantasma) => (
                        <Col md={4} key={fantasma} className="mb-3">
                            <Card>
                                <Card.Body>
                                    <Placeholder as={Card.Title} animation="glow">
                                        <Placeholder xs={6} />
                                    </Placeholder>
                                    <Placeholder as="h5" animation="glow" className="mt-3">
                                        <Placeholder xs={4} bg="warning" />
                                    </Placeholder>
                                    <Placeholder.Button variant="primary" xs={12} className="mt-2" disabled />
                                </Card.Body>
                            </Card>
                        </Col> 
                    ))
                 ) : turnos.length === 0 ? (
                    
                        <p>No se encontraron turnos pendientes.</p>
                    
                ) : 
                turnosFiltrados.map((turno) => (
                    <Col md={4} key={turno.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{turno.paciente.nombre}</Card.Title>
                               
                                <h5 className="mt-3">
                                    {turno.estado === 'atendido' 
                                        ? <Badge bg="success">Atendido</Badge> 
                                        : <Badge bg="warning" text="dark"> En Espera</Badge>
                                    }
                                </h5>
                                <Button onClick={() => marcarComoAtendido(turno.id)} disabled={turno.estado === 'atendido'}>Llamar</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default DashboardRecepcion;
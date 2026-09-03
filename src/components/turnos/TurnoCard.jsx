import { Link } from "react-router-dom";
import { Col, Card, Badge, Button, Stack } from "react-bootstrap";

const TurnoCard = ({ turno, onAtender }) => {
    const paciente = turno.paciente;
    const fecha = new Date(turno.fechaTurno);

    return (
        <Col xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-white border-0 pt-3 px-3">
                    <Stack direction="horizontal" className="justify-content-between align-items-start">
                        <Card.Title className="h5 mb-0">
                            {paciente?.nombre ?? "Paciente sin asignar"}
                        </Card.Title>
                        <Badge bg={turno.estado === "atendido" ? "success" : "warning"} text={turno.estado === "atendido" ? undefined : "dark"}>
                            {turno.estado === "atendido" ? "Atendido" : "En espera"}
                        </Badge>
                    </Stack>
                </Card.Header>
                <Card.Body className="px-3 pt-2">
                    <div className="text-body-secondary small mb-2">
                        <strong className="text-dark text-capitalize">{turno.especialidad}</strong>
                    </div>
                    <div className="mb-2">
                        <span className="fw-semibold">{fecha.toLocaleDateString("es-AR")}</span>
                        <span className="text-body-secondary"> · {fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs</span>
                    </div>
                    {paciente?.dni && <div className="small text-body-secondary">DNI: {paciente.dni}</div>}
                </Card.Body>
                <Card.Footer className="bg-white border-0 px-3 pb-3">
                    <Stack direction="horizontal" gap={2}>
                        <Button as={Link} to={`/turno-detalle/${turno.id}`} variant="outline-secondary" className="flex-grow-1">
                            Ver detalle
                        </Button>
                        <Button
                            onClick={() => onAtender(turno.id)}
                            disabled={turno.estado === "atendido" || !paciente}
                            variant="primary"
                        >
                            Llamar
                        </Button>
                    </Stack>
                </Card.Footer>
            </Card>
        </Col>
    );
};

export default TurnoCard;
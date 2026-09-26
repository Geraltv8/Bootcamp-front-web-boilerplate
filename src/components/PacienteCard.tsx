import { Button, Card } from "react-bootstrap";
import type { ButtonProps } from "react-bootstrap";

interface PacienteCardProps {
    nombre: string;
    obraSocial?: string;
    dni: string;
    variant?: ButtonProps["variant"];
}

const PacienteCard = ({ nombre, obraSocial = "particular", dni, variant = "primary" }: PacienteCardProps) => {
    return (
        <Card>
            <h2>Nombre: {nombre}</h2>
            <p>Obra Social: {obraSocial}</p>
            <p>DNI: {dni}</p>
            <Button variant={variant}> ver historia clinica</Button>
        </Card>
    );
};

export default PacienteCard;
import { useState } from 'react';
import { Button, Alert, Spinner, Card, CardBody } from 'react-bootstrap';
import clientesAxios from '../../config/axios';
import { toast } from 'sonner';

const GeneradorResumenIA = ({ notasCrudas }: { notasCrudas: string }) => {
    const [cargandoIA, setCargandoIA] = useState(false);
    const [analisis, setAnalisis] = useState<any>(null); // Idealmente tipado con la interfaz

    const solicitarAnalisis = async () => {
        setCargandoIA(true);
        try {
            // Consumimos nuestro Backend Proxy (que inyecta el JWT gracias al interceptor)
            const respuesta = await clientesAxios.post('/ia/analizar', {
                notasDelMedico: notasCrudas
            });
            
            setAnalisis(respuesta.data.data);
            toast.success("Análisis generado por Gemini");
        } catch (error) {
            toast.error("La IA está saturada. Intente de nuevo.");
        } finally {
            setCargandoIA(false);
        }
    };

    return (
         <Card className="mt-3 border-info">
            <Card.Body>
                <Card.Title>Asistente Médico IA ✨</Card.Title>
                
                {!analisis ? (
                    <Button 
                        variant="outline-info" 
                        onClick={solicitarAnalisis}
                        disabled={cargandoIA || !notasCrudas}
                    >
                        {cargandoIA ? (
                            <> <Spinner as="span" animation="border" size="sm" /> Procesando... </>
                        ) : (
                            "Analizar notas con Gemini"
                        )}
                    </Button>
                ) : (
                    <div>
                        <Alert variant={analisis.gravedad === 'ALTA' ? 'danger' : 'success'}>
                            <strong>Gravedad: {analisis.gravedad}</strong>
                        </Alert>
                        <p><strong>Resumen:</strong> {analisis.resumenCorto}</p>
                        <p><strong>Medicamentos:</strong> {analisis.medicamentosMencionados.join(', ')}</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default GeneradorResumenIA;
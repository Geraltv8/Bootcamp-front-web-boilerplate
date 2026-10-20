import { useState } from 'react';
import { Button, Alert, Spinner, Card } from 'react-bootstrap';
import { toast } from 'sonner';
import getApiErrorMessage from '../../hooks/getApiErrorMessage';
import useApiMutation from '../../hooks/useApiMutation';
import type { AnalisisHistorial } from '../../types/Api.type';

const GeneradorResumenIA = ({ notasCrudas }: { notasCrudas: string }) => {
    const [analisis, setAnalisis] = useState<AnalisisHistorial | null>(null);
    const { mutate: analizar, isLoading: cargandoIA } = useApiMutation<
        { notasDelMedico: string },
        AnalisisHistorial
    >('post', '/ia/analizar');

    const solicitarAnalisis = async () => {
        try {
            const resultado = await analizar({
                notasDelMedico: notasCrudas
            });
            setAnalisis(resultado);
            toast.success('Análisis generado por Gemini');
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, 'La IA está saturada. Intenta de nuevo.'));
        }
    };

    return (
         <Card className="mt-3 border-info">
            <Card.Body>
                <Card.Title>Asistente Médico IA ✨</Card.Title>
                
                {!analisis ? (
                    <Button 
                        variant="outline-info" 
                        onClick={() => void solicitarAnalisis()}
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
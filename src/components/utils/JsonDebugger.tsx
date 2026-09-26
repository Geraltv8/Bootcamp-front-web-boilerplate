import type { FieldValues, UseFormWatch } from 'react-hook-form';

interface JsonDebuggerProps<T> {
    watch: UseFormWatch<T & FieldValues>;
    titulo?: string;
}

const JsonDebugger = <T,>({ watch, titulo = "Estado actual del JSON" }: JsonDebuggerProps<T>) => {
    const data = watch();
    if (!data) return null;

    return (
        <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#1e1e1e',
            color: '#4af626',
            borderRadius: '8px',
            fontFamily: 'monospace',
            overflowX: 'auto'
        }}>
            <p style={{ margin: '0 0 10px 0', color: '#fff', fontWeight: 'bold' }}>
                {titulo}
            </p>
            <pre style={{ margin: 0 }}>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};

export default JsonDebugger;
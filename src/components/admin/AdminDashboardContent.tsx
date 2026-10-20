import { useState } from 'react';
import { Button, Container, Stack } from 'react-bootstrap';
import EspecialidadesAdminSection from './EspecialidadesAdminSection';
import MedicosAdminSection from './MedicosAdminSection';

const AdminDashboardContent = () => {
    const [tab, setTab] = useState<'medicos' | 'especialidades'>('medicos');

    return (
        <Container className="py-4">
            <h1 className="h2 mb-4">Administración</h1>
            <Stack direction="horizontal" gap={2} className="mb-4">
                <Button variant={tab === 'medicos' ? 'primary' : 'outline-primary'} onClick={() => setTab('medicos')}>Médicos</Button>
                <Button variant={tab === 'especialidades' ? 'primary' : 'outline-primary'} onClick={() => setTab('especialidades')}>Especialidades</Button>
            </Stack>
            {tab === 'medicos' ? <MedicosAdminSection /> : <EspecialidadesAdminSection />}
        </Container>
    );
};

export default AdminDashboardContent;

import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import useApiQuery from '../../hooks/useApiQuery';
import type { Especialidad, Medico } from '../../types/Api.type';
import DoctorAccountForm, { type CreatedMedicalAccount } from './DoctorAccountForm';
import DoctorProfileForm from './DoctorProfileForm';
import DoctorsList from './DoctorsList';

const MedicosAdminSection = () => {
    const [cuentaMedico, setCuentaMedico] = useState<CreatedMedicalAccount | null>(null);
    const [medicoEditando, setMedicoEditando] = useState<Medico | null>(null);
    const especialidades = useApiQuery<Especialidad[]>('/especialidades?incluirInactivas=true');

    const accountCreated = (account: CreatedMedicalAccount) => {
        setCuentaMedico(account);
        setMedicoEditando(null);
    };

    const saveCompleted = () => {
        setCuentaMedico(null);
        setMedicoEditando(null);
    };

    const cancelEditing = () => {
        setCuentaMedico(null);
        setMedicoEditando(null);
    };

    const startEditing = (doctor: Medico) => {
        setCuentaMedico(null);
        setMedicoEditando(doctor);
    };

    return (
        <Row className="g-4">
            <Col xs={12} xl={5}>
                <DoctorAccountForm onCreated={accountCreated} />
                <DoctorProfileForm
                    account={cuentaMedico}
                    editingDoctor={medicoEditando}
                    especialidades={especialidades.data ?? []}
                    onSaved={saveCompleted}
                    onCancel={cancelEditing}
                />
            </Col>
            <Col xs={12} xl={7}>
                <DoctorsList onEdit={startEditing} />
            </Col>
        </Row>
    );
};

export default MedicosAdminSection;

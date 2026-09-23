import { Col, Card, Placeholder, Stack } from 'react-bootstrap';

const TurnoCardSkeleton = () => {
    return (
        <Col xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm" aria-hidden="true">
                <Card.Header className="bg-white border-0 pt-3 px-3">
                    <Placeholder as="div" animation="glow">
                        <Placeholder xs={7} />
                    </Placeholder>
                </Card.Header>
                <Card.Body className="px-3 pt-2">
                    <Placeholder as="div" animation="glow" className="mb-2">
                        <Placeholder xs={4} />
                    </Placeholder>
                    <Placeholder as="div" animation="glow" className="mb-2">
                        <Placeholder xs={8} />
                    </Placeholder>
                    <Placeholder as="div" animation="glow">
                        <Placeholder xs={5} />
                    </Placeholder>
                </Card.Body>
                <Card.Footer className="bg-white border-0 px-3 pb-3">
                    <Stack direction="horizontal" gap={2}>
                        <Placeholder.Button variant="secondary" xs={7} disabled />
                        <Placeholder.Button variant="primary" xs={5} disabled />
                    </Stack>
                </Card.Footer>
            </Card>
        </Col>
    );
}

export default TurnoCardSkeleton;
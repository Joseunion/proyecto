"use client";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VolverAtras from "./volverAtras";

export default function CardCentral({ Content }) {
    return (
        <Container className="bg-body-tertiary px-0 px-sm-3  min-vh-100" fluid>
            <Row className="justify-content-center py-sm-4">
                <Col md={11} xl={9} xxl={7}>
                    <Card className="shadow-lg border-0 border-sm rounded-0 rounded-sm-2 p-sm-3">
                        <Card.Body>
                            <VolverAtras/>
                            {Content}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

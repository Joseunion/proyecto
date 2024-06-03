"use client";
//import Image from "next/image";
import Link from "next/link";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [mensajeError, setMensajeError] = useState("");
    const router = useRouter();
    return (
        <Container
            style={{
                backgroundImage: "url('/patternEmojis.svg')",
                backgroundRepeat: "repeat",
                backgroundPosition: "center center",
            }}
            fluid
        >
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col md={11} lg={11} xl={9} xxl={7}>
                    <Card className="shadow-lg">
                        <Card.Body className="p-0">
                            <Row>
                                <Col
                                    className="rounded-start"
                                    style={{
                                        backgroundImage:
                                            "url('/libreria.webp')",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center center",
                                    }}
                                    lg={5}
                                ></Col>
                                <Col className="p-5" lg={7}>
                                    <h1 className="fw-semibold">
                                        RemindsMeOf
                                    </h1>
                                    <h3 className="fw-semibold">
                                        Iniciar sesión
                                    </h3>
                                    <Form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const respuesta = await signIn(
                                                "credentials",
                                                {
                                                    email: e.currentTarget.email
                                                        .value,
                                                    password:
                                                        e.currentTarget.password
                                                            .value,
                                                    redirect: false,
                                                }
                                            );
                                            if (respuesta.ok) {
                                                router.push("/");
                                            } else {
                                                setMensajeError(
                                                    respuesta.error
                                                );
                                            }
                                            
                                        }}
                                        className="mb-3"
                                    >
                                        <Form.Group
                                            as={Row}
                                            className="mb-3"
                                            controlId="email"
                                        >
                                            <Form.Label column sm={4}>
                                                Correo electronico
                                            </Form.Label>
                                            <Col sm={8}>
                                                <InputGroup>
                                                    <InputGroup.Text>
                                                        <i className="fa-solid fa-envelope text-muted"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        className="me-auto rounded-end"
                                                        type="email"
                                                        placeholder="example@gmail.com"
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group
                                            as={Row}
                                            className="mb-3"
                                            controlId="password"
                                        >
                                            <Form.Label column sm={4}>
                                                Contraseña
                                            </Form.Label>
                                            <Col sm={8}>
                                                <InputGroup>
                                                    <Form.Control
                                                        type={
                                                            passwordVisible
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        placeholder="***********"
                                                    />
                                                    <InputGroup.Text
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        className="rounded-end"
                                                        onClick={() => {
                                                            setPasswordVisible(
                                                                !passwordVisible
                                                            );
                                                        }}
                                                    >
                                                        {passwordVisible ? (
                                                            <i className="fa-solid fa-eye-slash"></i>
                                                        ) : (
                                                            <i className="fa-solid fa-eye"></i>
                                                        )}
                                                    </InputGroup.Text>
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                        <p className="fw-semibold text-danger">
                                            {mensajeError}
                                        </p>
                                        {/* <Link
                                            className="text-decoration-none"
                                            href="/"
                                            passHref
                                        > */}
                                        <div className="d-grid gap-2">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                            >
                                                Iniciar sesión
                                            </Button>
                                        </div>
                                        {/* </Link> */}
                                    </Form>
                                    <p>
                                        ¿No tienes cuenta?{" "}
                                        <Link
                                            className="text-decoration-none"
                                            href="/signup"
                                        >
                                            Crea una gratuitamente
                                        </Link>
                                    </p>
                                    <hr />
                                    <Stack gap={3}>
                                        <div className="d-grid gap-2">
                                            <Button
                                                variant="dark"
                                                onClick={() =>
                                                    signIn("github", {
                                                        callbackUrl: "/",
                                                    })
                                                }
                                            >
                                                <Stack
                                                    className="justify-content-center align-items-center"
                                                    direction="horizontal"
                                                    gap={2}
                                                >
                                                    <i className="fa-brands fa-github" />
                                                    Iniciar sesión con Github
                                                </Stack>
                                            </Button>
                                        </div>
                                        <div className="d-grid gap-2">
                                            <Button
                                                className="border border-2"
                                                variant="light"
                                                onClick={() =>
                                                    signIn("google", {
                                                        callbackUrl: "/",
                                                    })
                                                }
                                            >
                                                <Stack
                                                    className="justify-content-center align-items-center"
                                                    direction="horizontal"
                                                    gap={2}
                                                >
                                                    <i className="fa-brands fa-google"></i>{" "}
                                                    Iniciar sesión con Google
                                                </Stack>
                                            </Button>
                                        </div>
                                    </Stack>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

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
import { Toast } from "react-bootstrap";
import { useEasyToast } from "easy-toast-react-bootstrap";
import { CloseButton } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import ReCAPTCHA from "react-google-recaptcha";
import crypto from "crypto"

export default function Signup() {
    const [showToast, closeToast] = useEasyToast();
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [captcha, setCaptcha] = useState(false);
    const [captchaNoValido, setCaptchaNoValido] = useState(false)
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
    const [passwordsNoCoinciden, setPasswordsNoCoinciden] = useState(false);

    const crearCuenta = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const fechaNacimiento = e.target.fechaNacimiento.value
            .split("-")
            .reverse()
            .join("/");
        const passwordConfirmation = e.target.passwordConfirmation.value;
        
        if (!captcha && process.env.NODE_ENV=="production"){
            setCaptchaNoValido(true);
            return
        }
        else {
            setCaptchaNoValido(false)
        }
        if (password != passwordConfirmation) {
            setPasswordsNoCoinciden(true);
        } else {
            setPasswordsNoCoinciden(false);
            const passwordHash = crypto.pbkdf2Sync(password, 'salt', 10000, 64, 'sha512').toString("hex")

            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password: passwordHash,
                    fechaNacimiento: fechaNacimiento,
                }),
            }).then(async (response) => {
                if (response.ok) {
                    router.push("/login");
                    showToast(
                        <Toast
                            bg="success"
                            autohide
                            delay={5000}
                            className="text-white"
                        >
                            <Stack direction="horizontal" gap={2}>
                                <Toast.Body>
                                    Cuenta creada correctamente
                                </Toast.Body>
                                <CloseButton
                                    className="me-2 m-auto"
                                    variant="white"
                                    onClick={closeToast}
                                />
                            </Stack>
                        </Toast>
                    );
                } else {
                    showToast(
                        <Toast
                            bg="danger"
                            autohide
                            delay={5000}
                            className="text-white"
                        >
                            <Stack direction="horizontal" gap={2}>
                                <Toast.Body>{await response.text()}</Toast.Body>
                                <CloseButton
                                    className="me-2 m-auto"
                                    variant="white"
                                    onClick={closeToast}
                                />
                            </Stack>
                        </Toast>
                    );
                }
            });
        }
    };

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
                                        Crear cuenta
                                    </h3>
                                    <Form
                                        onSubmit={crearCuenta}
                                        className="mb-3"
                                    >
                                        <Form.Group
                                            as={Row}
                                            className="mb-3"
                                            controlId="username"
                                        >
                                            <Form.Label column sm={5}>
                                                Nombre de usuario
                                            </Form.Label>
                                            <Col sm={7}>
                                                <InputGroup>
                                                    <InputGroup.Text className="text-muted">
                                                        @
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        className="me-auto rounded-end"
                                                        type="text"
                                                        placeholder="username"
                                                        required
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group
                                            as={Row}
                                            className="mb-3"
                                            controlId="email"
                                        >
                                            <Form.Label column sm={5}>
                                                Correo electronico
                                            </Form.Label>
                                            <Col sm={7}>
                                                <InputGroup>
                                                    <InputGroup.Text>
                                                        <i className="fa-solid fa-envelope text-muted"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        className="me-auto rounded-end"
                                                        type="email"
                                                        placeholder="example@gmail.com"
                                                        required
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group
                                            as={Row}
                                            className="mb-3"
                                            controlId="fechaNacimiento"
                                        >
                                            <Form.Label column sm={5}>
                                                Fecha nacimiento
                                            </Form.Label>
                                            <Col sm={7}>
                                                <InputGroup>
                                                    <InputGroup.Text>
                                                        <i className="fa-solid fa-calendar"></i>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        className="me-auto rounded-end"
                                                        type="date"
                                                        required
                                                    />
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group
                                            as={Row}
                                            className="mb-3"
                                            controlId="password"
                                        >
                                            <Form.Label column sm={5}>
                                                Contraseña
                                            </Form.Label>
                                            <Col sm={7}>
                                                <InputGroup>
                                                    <Form.Control
                                                        type={
                                                            passwordVisible
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        placeholder="***********"
                                                        required
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
                                        <Form.Group
                                            as={Row}
                                            className="mb-3"
                                            controlId="passwordConfirmation"
                                        >
                                            <Form.Label column sm={5}>
                                                Confirmar contraseña
                                            </Form.Label>
                                            <Col sm={7}>
                                                <InputGroup>
                                                    <Form.Control
                                                        type={
                                                            passwordConfirmVisible
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        placeholder="***********"
                                                        required
                                                    />
                                                    <InputGroup.Text
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        className="rounded-end"
                                                        onClick={() => {
                                                            setPasswordConfirmVisible(
                                                                !passwordConfirmVisible
                                                            );
                                                        }}
                                                    >
                                                        {passwordConfirmVisible ? (
                                                            <i className="fa-solid fa-eye-slash"></i>
                                                        ) : (
                                                            <i className="fa-solid fa-eye"></i>
                                                        )}
                                                    </InputGroup.Text>
                                                </InputGroup>
                                            </Col>
                                        </Form.Group>
                                        {passwordsNoCoinciden && (
                                            <p className="fw-semibold text-danger">
                                                Las contraseñas no coinciden
                                            </p>
                                        )}
                                        {captchaNoValido && (
                                            <p className="fw-semibold text-danger">
                                                Debes validar el Captcha
                                            </p>
                                        )}
                                        {process.env.NODE_ENV === 'production' && 
                                        <div className="d-flex justify-content-center pb-4">
                                            <Form.Check
                                                className="d-none"
                                                checked={captcha}
                                                type="checkbox"
                                            />
                                            <ReCAPTCHA
                                                sitekey="6LdyxOspAAAAAL6IQj7f8PbSkxpa39Okp756P-Tt"
                                                onChange={() => setCaptcha(true)}
                                                onExpired={() => setCaptcha(false)}
                                                onError={() => setCaptcha(false)}
                                            />
                                        </div>
                                        }
                                        <div className="d-grid gap-2">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                            >
                                                Crear cuenta
                                            </Button>
                                        </div>
                                    </Form>
                                    <p>
                                        ¿Ya tienes cuenta?{" "}
                                        <Link
                                            className="text-decoration-none"
                                            href="/login"
                                        >
                                            Inicia sesión con ella
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

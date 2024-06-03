"use client";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import Link from "next/link";
import Estrellas from "./Estrellas";
import parse from "html-react-parser";
import { useSession } from "next-auth/react";
import { Toast } from "react-bootstrap";
import { useEasyToast } from "easy-toast-react-bootstrap";
import { CloseButton } from "react-bootstrap";

export default function MediaMasTarde({ m, update }) {
    const [showToast, closeToast] = useEasyToast();
    const [show, setShow] = useState(false);
    const session = useSession();
    const tipoAutor = {
        pelicula: "Dirigida por:",
        libro: "Escrito por:",
        musica: "Artistas:",
        videojuego: "Desarrollado por:",
        undefined: "Autor:",
    };

    return (
        <Card className="mb-3">
            <Row className="g-0">
                <Col className="col-12 col-sm-4">
                    <Image
                        fluid
                        // Para evitar tarjetas muy grandes en pantallas anchas
                        //style={{ maxHeight: "400px", width: "100%" }}
                        className="object-fit-cover h-sm-100 rounded"
                        src={m.imagen}
                        alt={"Portada de la pelicula" + m.nombre}
                    />
                </Col>
                <Col className="col-sm-8 p-1 p-lg-4">
                    <div className="p-3 h-100 d-flex flex-column gap-3">
                        <div className="flex-fill">
                            <Row>
                                <Col
                                    xs={12}
                                    sm={m.tipo === "musica" ? 12 : "auto"}
                                >
                                    <Stack direction={"horizontal"} gap={3}>
                                        <h4 className="fw-lg-semibold">
                                            {m.nombre}
                                        </h4>
                                        {m.tipo !== "musica" && (
                                            <Badge
                                                bg={m.tipo.toLowerCase()}
                                                pill
                                            >
                                                {m.tipo
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    m.tipo.slice(1)}
                                            </Badge>
                                        )}
                                    </Stack>
                                    {m.tipo === "musica" && (
                                        <Badge bg={m.tipo.toLowerCase()} pill>
                                            {m.tipo.charAt(0).toUpperCase() +
                                                m.tipo.slice(1)}
                                        </Badge>
                                    )}
                                </Col>
                                <Col className={m.tipo === "musica" && "pt-2"}>
                                    <span className="fw-bold  ms-lg-auto">
                                        {tipoAutor[m.tipo]}{" "}
                                    </span>
                                    <em className="text-black">{m.autor.map((g, i) => {
                                        if (i == m.autor.length - 1)
                                            return g;
                                        else return g + ", ";
                                    })}</em>
                                </Col>
                            </Row>
                            {m.generos != undefined && (
                                <div className="pt-2">
                                    <b>Géneros: </b>
                                    {m.generos.map((g, i) => {
                                        if (i == m.generos.length - 1)
                                            return g + ".";
                                        else return g + ", ";
                                    })}
                                </div>
                            )}
                            <Card.Text className="pt-2 text-secondary">
                                {/* Añadir parseo a HTML */}
                                {parse(m.descripcion ? m.descripcion : "")}
                            </Card.Text>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-2 pt-auto mb-2">
                            <Stack
                                className="justify-content-center flex-fill justify-content-md-start text-body-secondary"
                                direction="horizontal"
                                gap={2}
                            >
                            </Stack>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="danger"
                                    onClick={() => setShow(true)}
                                >
                                    Eliminar de la lista
                                </Button>
                            </div>
                            <div className="d-grid gap-2">
                                <Link href={`/nuevaReview?tipoMedia=${m.tipo}&idMedia=${m.id}`}>
                                    <Button variant="primary">
                                        Hacer review
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal centered show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Seguro que quieres eliminar <b>{m.nombre}</b> de tu lista?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            fetch(
                                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${session.data.user.id}/masTarde/${m.idMediaRecuerda}`,
                                {
                                    method: "DELETE",
                                    headers: {
                                        Authorization: `Bearer ${session.data.user.token}`,
                                        "Content-Type": "application/json",
                                    },
                                }
                            ).then(async (res) => {
                                if (res.ok) {
                                    showToast(
                                        <Toast
                                            bg="success"
                                            autohide
                                            delay={5000}
                                            className="text-white"
                                        >
                                            <Stack
                                                direction="horizontal"
                                                gap={2}
                                            >
                                                <Toast.Body>
                                                    Para + tarde eliminado
                                                    correctamente
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
                                    // setTextoToast("nopeee");
                                    // setEliminadoOk(false);
                                    // setShowToast(true);
                                    showToast(
                                        <Toast
                                            bg="danger"
                                            autohide
                                            delay={5000}
                                            className="text-white"
                                        >
                                            <Stack
                                                direction="horizontal"
                                                gap={2}
                                            >
                                                <Toast.Body>
                                                    {await response.text()}
                                                </Toast.Body>
                                                <CloseButton
                                                    className="me-2 m-auto"
                                                    variant="white"
                                                    onClick={closeToast}
                                                />
                                            </Stack>
                                        </Toast>
                                    );
                                }
                                update();
                            });
                            setShow(false);
                        }}
                    >
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
            >
                <Toast.Body>
                    Woohoo, you're reading this text in a Toast!
                </Toast.Body>
            </Toast> */}
        </Card>
    );
}

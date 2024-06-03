"use client";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import Estrellas from "./Estrellas";
import { useSession } from "next-auth/react";
import { useEasyToast } from "easy-toast-react-bootstrap";
import { Toast } from "react-bootstrap";
import { CloseButton } from "react-bootstrap";

export default function MediaPequena({ m }) {
    const [showToast, closeToast] = useEasyToast();
    const session = useSession();

    const urlColeccion = {
        pelicula: "peliculas",
        videojuego: "juegos",
        libro: "libros",
        musica: "musica",
    };

    const tipoAutor = {
        pelicula: "Dirigida por:",
        libro: "Escrito por:",
        musica: "Artistas:",
        videojuego: "Desarrollado por:",
        undefined: "Autor:",
    };
    const truncateDescription = (text, maxLength) => {
        if (text && text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        } else {
            return text;
        }
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
                        alt={"Portada de la media " + m.nombre}
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
                                            <Badge bg="black" pill>
                                                {m.fecha_salida}
                                            </Badge>
                                        )}
                                    </Stack>
                                    {m.tipo === "musica" && (
                                        <Badge bg="black" pill>
                                            {m.fecha_salida}
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
                                {m.tipo !== 0 ? truncateDescription(m.descripcion, 150) : m.descripcion}
                            </Card.Text>
                        </div>
                        <div className="d-flex flex-column flex-md-row gap-2 pt-auto mb-2">
                            <Stack
                                className="justify-content-center flex-fill justify-content-md-start text-body-secondary"
                                direction="horizontal"
                                gap={2}
                            >
                                <Estrellas calificacion={m.calificacion} />
                            </Stack>
                            
                            <Link
                                className="text-decoration-none"
                                href={
                                    "/" + urlColeccion[m.tipo] + "/" + m.id
                                }
                                passHref
                            >
                                <div className="d-grid gap-2">
                                    <Button variant="secondary">
                                        Ver info
                                    </Button>
                                </div>
                            </Link>
                            {session.status == "authenticated" && (
                                <>
                                    
                                    <Link
                                    className="text-decoration-none"
                                    href={`/nuevaReview?tipoMedia=${m.tipo}&idMedia=${m.id}`}>
                                        <div className="d-grid gap-2">
                                            <Button variant="primary">
                                                Hacer review
                                            </Button>
                                        </div>
                                    </Link>
                                    <div className="d-grid gap-2">
                                        <Button
                                            onClick={() => {
                                                fetch(
                                                    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${session.data.user.id}/masTarde`,
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            Authorization: `Bearer ${session.data.user.token}`,
                                                            "Content-Type":
                                                                "application/json",
                                                        },
                                                        body: JSON.stringify({
                                                            masTarde: {
                                                                media: {
                                                                    tipo: m.tipo,
                                                                    idMedia:
                                                                        m.id,
                                                                },
                                                            },
                                                        }),
                                                    }
                                                ).then(async (response) => {
                                                    if (response.ok) {
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
                                                                        Para +
                                                                        tarde
                                                                        añadido
                                                                        correctamente
                                                                    </Toast.Body>
                                                                    <CloseButton
                                                                        className="me-2 m-auto"
                                                                        variant="white"
                                                                        onClick={
                                                                            closeToast
                                                                        }
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
                                                                        onClick={
                                                                            closeToast
                                                                        }
                                                                    />
                                                                </Stack>
                                                            </Toast>
                                                        );
                                                    }
                                                });
                                            }}
                                            variant="info"
                                        >
                                            Para + tarde
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}

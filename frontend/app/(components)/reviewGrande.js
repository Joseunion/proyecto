"use client";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Carousel from "react-bootstrap/Carousel";
import { useEffect, useState } from "react";
import Link from "next/link";
import Estrellas from "./Estrellas";
import '@github/relative-time-element';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Dropdown from 'react-bootstrap/Dropdown';

export default function ReviewGrande({ r, extra, full, updateReview, miPerfil }) {
    const router = useRouter();
    const session = useSession();

    useEffect(() => {
        if (session.status == "authenticated") setLike(r.likes.some((l) => l.id === session.data.user.id))
        else if (session.status == "unauthenticated") setLike(false)
    },[session, r])
    //
    // const like =

    const [like, setLike] = useState(false);

    /*
    useEffect(() => {
        
		fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + r.usuario.id + "/reviews/" + r._id + "/like",
			{
                method: "GET",
            }
            
        )
        .then((response) => response.json())
        .then((data) => {
            data.likesReview.map((e) => {
                if (e.id == session.data.user.id){
                    setLike(true)
                }
            })
        }
        )
	}, []);
    */

    const handleClick = () => {
        // Obtener el tipo de media y el ID de la media
        const tipoMedia = r.media.tipo;
        const idMedia = r.media.idMedia;
        
        // Redirigir a la página /nuevaReview con los parámetros tipoMedia e idMedia
        router.push(`/editarReview?tipoMedia=${tipoMedia}&idMedia=${idMedia}&idReview=${r._id}`);
    };
    const handleLikeReview = () => {
        
        
        if (session.status === "authenticated") {
            fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + r.usuario.id + "/reviews/" + r._id + "/like",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session.data.user.token}`,
                    },
                }
            )
                .then((response) => {updateReview()})
            .catch((error) => {
                console.error("Error al dar like:", error);
            });
        }
    };

    const handleDislikeReview = () => {
        
        
        if (session.status === "authenticated") {
            fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + r.usuario.id + "/reviews/" + r._id + "/like",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${session.data.user.token}`,
                    },
                }
            )
                .then((response) => {updateReview()})
            .catch((error) => {
                console.error("Error al dar like:", error);
            });
        }
    };

    const handleDeleteReview = () => {
        if (session.status === "authenticated") {
            
            fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + r.usuario.id + "/reviews/" + r._id,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${session.data.user.token}`,
                    },
                }
            )
                .then((response) => {updateReview()})
            .catch((error) => {
                console.error("Error al borrar:", error);
                
            });
        }
    };


    
    const [tipoMediaSeleccionada, setTipoMediaSeleccionada] =
        useState("pelicula");

    const media = {
        pelicula: r.mediaRecuerda
            .filter((e) => e.tipo === "pelicula")
            .map((p) => {
                return (
                    <Carousel.Item key={p._id}>
                        <Row className="py-4 justify-content-center">
                            <Col xs={7} md={2}>
                                <Image fluid src={p.imagen} />
                            </Col>
                        </Row>
                        <Row className="pb-5 text-center justify-content-center">
                            <Col md={4}>{p.titulo}</Col>
                        </Row>
                    </Carousel.Item>
                );
            }),
        libro: r.mediaRecuerda
            .filter((e) => e.tipo === "libro")
            .map((p) => {
                return (
                    <Carousel.Item key={p._id}>
                        <Row className="py-4 justify-content-center">
                            <Col xs={7} md={2}>
                                <Image fluid src={p.imagen} />
                            </Col>
                        </Row>
                        <Row className="pb-5 text-center justify-content-center">
                            <Col md={4}>{p.titulo}</Col>
                        </Row>
                    </Carousel.Item>
                );
            }),
        videojuego: r.mediaRecuerda
            .filter((e) => e.tipo === "videojuego")
            .map((p) => {
                return (
                    <Carousel.Item key={p._id}>
                        <Row className="py-4 justify-content-center">
                            <Col xs={7} md={2}>
                                <Image fluid src={p.imagen} />
                            </Col>
                        </Row>
                        <Row className="pb-5 text-center justify-content-center">
                            <Col md={4}>{p.titulo}</Col>
                        </Row>
                    </Carousel.Item>
                );
            }),
        musica: r.mediaRecuerda
            .filter((e) => e.tipo === "musica")
            .map((p) => {
                return (
                    <Carousel.Item key={p._id}>
                        <Row className="py-4 justify-content-center">
                            <Col xs={7} md={2}>
                                <Image fluid src={p.imagen} />
                            </Col>
                        </Row>
                        <Row className="pb-5 text-center justify-content-center">
                            <Col md={4}>{p.titulo}</Col>
                        </Row>
                    </Carousel.Item>
                );
            }),
    };

    return (
        <Card className="mb-3">
            <Row className="g-0">
                <Col className="col-12 col-sm-4">
                    <Image
                        fluid
                        // Para evitar tarjetas muy grandes en pantallas anchas
                        //style={{ maxHeight: "448px", width: "100%" }}
                        className="object-fit-cover h-sm-100 rounded-top"
                        src={r.media.imagen}
                        alt={"Portada de la pelicula " + r.media.titulo}
                    />
                </Col>
                <Col className="col-sm-8 p-1 p-lg-4">
                    <div className="p-3 h-100 d-flex flex-column gap-3">
                        <div className="flex-fill">
                            <Row>
                                <Col xs={12} sm={"auto"}>
                                    <Stack direction="horizontal" gap={3}>
                                        <h4 className="fw-lg-semibold">
                                            {r.media.titulo}
                                        </h4>
                                        <Badge 
                                            bg="black"
                                            pill
                                        >
                                            {r.media.tipo
													.charAt(0)
													.toUpperCase() +
													r.media.tipo.slice(1)}
                                        </Badge>
                                    </Stack>
                                </Col>
                                <Col>
                                    {!miPerfil ? 
                                    <span className="text-secondary ms-lg-auto">
                                        Review hecha por{" "}
                                        <Link
                                            className="text-decoration-none"
                                            href={"/perfil/" + r.usuario.id}
                                            passHref
                                        >
                                            <span className="text-primary fw-bold">
                                                {r.usuario.nombre}
                                            </span>
                                        </Link>
                                    </span>
                                    : 
                                    <Stack
                                        className="justify-content-center ml-3 justify-content-sm-start text-body-secondary text-secondary fs-4 ms-lg-auto"
                                        direction="horizontal"
                                        gap={3}
                                    >
                                            <i className="fa-regular fa-pen-to-square selectable" onClick={handleClick}></i>
                                            <i className="fa-solid fa-trash selectable" onClick={handleDeleteReview}></i>
                                    </Stack>}
                                </Col>
                            </Row>

                            <Card.Text className="pt-2 text-secondary">
                                {r.descripcion}
                            </Card.Text>
                        </div>
                        <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-4 mb-2">
                            <Estrellas calificacion={r.calificacion} />
                            <Stack
                                className="justify-content-center justify-content-sm-start text-body-secondary"
                                direction="horizontal"
                                gap={3}
                            >
                                <Stack className="text-danger" direction="horizontal" gap={1}>
                                    <i className={like ? "fa-solid fa-heart selectable" : "fa-regular fa-heart selectable"} onClick={like ?  handleDislikeReview : handleLikeReview}></i>
                                    {r.likes.length}
                                </Stack>
                                <Stack direction="horizontal" gap={1}>
                                    <i className="fa-regular fa-comment"></i>
                                    {r.comentarios.length}
                                </Stack>
                            </Stack>
                        </div>
                        <Row>
                            <Col xs={12} sm={7}>
                                <p className="text-center text-sm-start text-body-tertiary">
                                    Publicado{" "}
                                    <relative-time lang="es" datetime={r.fecha} tense="past" format="relative" prefix="Publicado">
                                        {r.fecha}
                                    </relative-time>
                                    
                                </p>
                            </Col>
                            {!full && (
                                <Col>
                                    <Link
                                        className="text-decoration-none"
                                        // FIX: cambiar cuando el route
                                        // href={
                                        //     "/perfil/" +
                                        //     r.usuarioReviewId +
                                        //     "/review/" +
                                        //     r.id
                                        // }
                                        href={
                                             "/perfil/" +
                                             r.usuario.id +
                                             "/resena/" +
                                             r._id
                                        }
                                        passHref
                                    >
                                        <div className="d-grid gap-2 pt-3 pt-sm-0 ms-auto">
                                            <Button variant="primary" size="sm">
                                                Ver review completa
                                            </Button>
                                        </div>
                                    </Link>
                                </Col>
                            )}
                        </Row>
                    </div>
                </Col>
            </Row>
            <Accordion>
                <Accordion.Item className="rounded-top-0" eventKey="0">
                    <Accordion.Header>
                        <span className="fw-bold">Le recuerda a:</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        {/* Botones en horizontal */}
                        <ToggleButtonGroup
                            type="radio"
                            name={"options_horizontal" + r._id}
                            onChange={(v) => {
                                
                                setTipoMediaSeleccionada(v);
                            }}
                            value={tipoMediaSeleccionada}
                            className="d-none d-sm-flex"
                        >
                            <ToggleButton
                                variant="outline-primary"
                                id={"pelicula_" + r._id}
                                value="pelicula"
                            >
                                Películas
                            </ToggleButton>
                            <ToggleButton
                                variant="outline-primary"
                                id={"libro_" + r._id}
                                value="libro"
                            >
                                Libros
                            </ToggleButton>
                            <ToggleButton
                                variant="outline-primary"
                                id={"videojuego" + r._id}
                                value="videojuego"
                            >
                                Videojuegos
                            </ToggleButton>
                            <ToggleButton
                                variant="outline-primary"
                                id={"musica" + r._id}
                                value="musica"
                            >
                                Música
                            </ToggleButton>
                        </ToggleButtonGroup>
                        {/* Botones en vertical  */}
                        <ToggleButtonGroup
                            vertical
                            type="radio"
                            name={"options_movil" + r._id}
                            onChange={(v) => {
                                
                                setTipoMediaSeleccionada(v);
                            }}
                            value={tipoMediaSeleccionada}
                            className="d-flex d-sm-none"
                        >
                            <ToggleButton
                                checked={tipoMediaSeleccionada == "pelicula"}
                                variant="outline-primary"
                                id={"peliculas_movil" + r._id}
                                value="pelicula"
                                onClick={() => {
                                    setTipoMediaSeleccionada("pelicula");
                                }}
                            >
                                Películas
                            </ToggleButton>
                            <ToggleButton
                                checked={tipoMediaSeleccionada == "libro"}
                                variant="outline-primary"
                                id={"libros_movil" + r._id}
                                value="libro"
                                onClick={() => {
                                    setTipoMediaSeleccionada("libro");
                                }}
                            >
                                Libros
                            </ToggleButton>
                            <ToggleButton
                                checked={tipoMediaSeleccionada == "videojuego"}
                                variant="outline-primary"
                                id={"videojuegos_movil" + r._id}
                                value="videojuego"
                                onClick={() => {
                                    setTipoMediaSeleccionada("videojuego");
                                }}
                            >
                                Videojuegos
                            </ToggleButton>
                            <ToggleButton
                                checked={tipoMediaSeleccionada == "musica"}
                                variant="outline-primary"
                                id={"musica_movil" + r._id}
                                value="musica"
                                onClick={() => {
                                    setTipoMediaSeleccionada("musica");
                                }}
                            >
                                Música
                            </ToggleButton>
                        </ToggleButtonGroup>

                        {media[tipoMediaSeleccionada].length != 0 ? (
                            <Carousel interval={null} data-bs-theme="dark">
                                {media[tipoMediaSeleccionada]}
                            </Carousel>
                        ) : (
                            <Row className="py-5 text-center justify-content-center">
                                <Col md={4}>
                                    <p className="fs-5">
                                        No le recuerda a ninguna media de este
                                        tipo
                                    </p>
                                </Col>
                            </Row>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {extra && <div className="p-4">{extra}</div>}
        </Card>
    );
}

"use client";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import "@github/relative-time-element"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Comentario({ c, idUsuario, idResena, updateComentario, miComentario }) {
    const [like, setLike] = useState(false);

    const session = useSession();

    useEffect(() => {
		fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + idUsuario + "/reviews/" + idResena + "/comentarios/" + c._id + "/like",
			{
                method: "GET",
            }
            
        )
        .then((response) => response.json())
        .then((data) => {
            data.likesComentarioReview.map((e) => {
                if (e.id == session.data.user.id){
                    setLike(true)
                }
            })
        }
        )
	}, []);

    const handleLikeComentario = () => {
        if (session.status === "authenticated") {
            fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + idUsuario + "/reviews/" + idResena + "/comentarios/" + c._id + "/like",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session.data.user.token}`,
                    },
                }
            )
                .then((response) => {if (response.ok) updateComentario()})
            .catch((error) => {
                console.error("Error al dar like:", error);
            });
        }
    };

    const handleDislikeComentario= () => {
        if (session.status === "authenticated") {
            fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + idUsuario + "/reviews/" + idResena + "/comentarios/" + c._id + "/like",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${session.data.user.token}`,
                    },
                }
            )
                .then((response) => {if (response.ok) updateComentario()})
            .catch((error) => {
                console.error("Error al dar like:", error);
            });
        }
    };

    const handleDeleteComentario= () => {
        if (session.status === "authenticated") {
            fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + idUsuario + "/reviews/" + idResena + "/comentarios/" + c._id,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${session.data.user.token}`,
                    },
                }
            )
                .then((response) => {if (response.ok) updateComentario()})
            .catch((error) => {
                console.error("Error al dar like:", error);
            });
        }
    };

    return (
        <Card className="p-3">
            <Row>
                <Col xs={3} md={1}>
                    <Image
                        fluid
                        src={c.usuario.imagen}
                        roundedCircle
                        className="border border-1"
                    />
                    <Stack
                        gap={1}
                        direction="horizontal"
                        className="pt-2 justify-content-center text-danger text-center"
                    >
                         <i className={like ? "fa-solid fa-heart selectable" : "fa-regular fa-heart selectable"} onClick={like ?  handleDislikeComentario : handleLikeComentario}></i>
                         {c.likes.length}
                    </Stack>
                </Col>
                <Col xs={9} md={11}>
                    <Stack>
                        <div className="d-flex flex-column flex-md-row gap-1 gap-md-3 pt-auto mb-2">
                            <Link
                                className="text-decoration-none"
                                href={"/perfil/" + c.usuario.id}
                                passHref
                            >
                                <span className="text-primary fw-semibold">
                                    {c.usuario.username}
                                </span>
                            </Link>
                            <span className="text-body-secondary">
                                <relative-time lang="es" datetime={c.fecha}>
                                    {c.fecha}
                                </relative-time>
                            </span>
                            {!miComentario ? <i className="fa-solid fa-trash selectable" onClick={handleDeleteComentario}></i> : null}
                        </div>
                        <div>{c.comentario}</div>
                    </Stack>
                </Col>
            </Row>
        </Card>
    );
}

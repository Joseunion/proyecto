"use client";
import CustomNavbar from "@/app/(components)/navbar";
import CardCentral from "@/app/(components)/cardCentral";
import ReviewGrande from "@/app/(components)/reviewGrande";
import Comentario from "@/app/(components)/comentario";
import { Stack, Button, Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Resena({ params: { id, idResena } }) {
    const [show, setShow] = useState(false);
    const [publicandoComentario, setPublicandoComentario] = useState(false);

    const session = useSession();

    const [review, setReview] = useState(undefined);

	const endpointGetReview =
		process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + id + "/reviews/" + idResena;

    const getReview = () =>{
        fetch(endpointGetReview)
			.then((response) => response.json())
			.then((data) => {
                if (data) {
                    
                    setReview(data);
                } else {
                    console.error('Data is not defined.');
                }
            }

        );
    }

	useEffect(() => {
		getReview()
	}, []);

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => {
        setShow(true);
    };

    const handlePublicarComentario = (c) => {
        if (c.trim().length > 0) {

            

            fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + id + "/reviews/" + idResena + "/comentarios",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session.data.user.token}`,
                    },
                    body: new URLSearchParams({
                        comentario : c
                    })
                }
            )
            .then((response) => response.json())
            .then(window.location.reload())
        }
    };

    const SeccionComentarios = () => {
        return (
            <Stack gap={3}>
                <div className="d-flex flex-column gap-2 flex-sm-row">
                    <span className="text-secondary mt-auto fs-5 fw-semibold">
                        Comentarios:
                    </span>
                    <div className="d-grid gap-2 ms-sm-auto">
                        <Button
                            onClick={handleShow}
                            size="md"
                            variant="primary"
                        >
                            Añadir comentario
                        </Button>
                    </div>
                </div>
                <Stack gap={2}>
                    {review.comentarios.map((c) => (
                        <Comentario key={c.id} c={c} idUsuario={id} idResena={idResena} miComentario={c.usuario.id === session.data?.user.token} updateComentario={() => {getReview()}} />
                    ))}
                </Stack>
            </Stack>
        );
    };

    const ContentModal = () => {
        if (publicandoComentario) {
            return (
                <div className="text-center">
                    <Spinner
                        className="text-secondary"
                        animation="border"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>{" "}
                </div>
            );
        } else
            return (
                <textarea
                    name="comentario"
                    placeholder="Escribe el comentario"
                    className="form-control"
                ></textarea>
            );
    };

    const ResenaPage = () => {
        if (review == undefined) return;
        return (
            <>
                <h1 className="fw-semibold">RemindsMeOf</h1>
                <hr className="border-2" />
                <ReviewGrande r={review} extra={<SeccionComentarios />} full updateReview={() => {
                    getReview()
                }} />
                <Modal
                    show={show}
                    onHide={handleClose}
                    centered
                    animation={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Añadir comentario</Modal.Title>
                    </Modal.Header>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handlePublicarComentario(e.target.comentario.value);
                        }}
                    >
                        <Modal.Body>
                            <ContentModal />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                disabled={publicandoComentario}
                                variant="secondary"
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                disabled={publicandoComentario}
                                variant="primary"
                                //onClick={handlePublicarComentario}
                                type="submit"
                            >
                                Publicar
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </>
        );
    };

    return (
        <>
            <CustomNavbar isLogged={true} />
            <CardCentral Content={<ResenaPage />} />
        </>
    );
}

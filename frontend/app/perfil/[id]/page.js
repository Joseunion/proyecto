"use client";
import CustomNavbar from "../../(components)/navbar";
import CardCentral from "../../(components)/cardCentral";
import ReviewGrande from "../../(components)/reviewGrande";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Card, Button, Image, Modal, ListGroup } from 'react-bootstrap';
import Estrellas from "../../(components)/Estrellas";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loader from "../../(components)/loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toast, Stack, CloseButton } from "react-bootstrap";
import { useEasyToast } from "easy-toast-react-bootstrap";

export default function PerfilPage({ params: { id } }) {
    const endpointGetPerfil = process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + id;
    const [perfilInfo, setPerfilInfo] = useState(undefined);
    const [notaMedia, setNotaMedia] = useState(0);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    const [showUnfollowConfirmModal, setShowUnfollowConfirmModal] = useState(false);
    const [unfollowUserId, setUnfollowUserId] = useState(null);
    const [showToast, closeToast] = useEasyToast();

    const fetchPerfilInfo = () => {
        fetch(endpointGetPerfil)
            .then((response) => response.json())
            .then((data) => {
                setPerfilInfo(data);
                calcularNotaMedia(data.reviews);
            })
            .catch((error) => {
                console.error('Error al obtener los libros:', error);
            });
    };
    
    useEffect(() => {
        // Llamar a la función fetchPerfilInfo una vez al montar el componente
        fetchPerfilInfo();
    }, []); // El array vacío [] indica que este efecto se ejecutará solo una vez al montar el componente
    
    // UseEffect para manejar la carga de datos de seguidores y seguidos después de que perfilInfo se haya establecido
    useEffect(() => {
        fetchUserData(perfilInfo?.seguidos, setFollowingData);   
        fetchUserData(perfilInfo?.seguidores, setFollowersData); 
    }, [perfilInfo, perfilInfo]); // Ejecutar este efecto cada vez que perfilInfo.seguidos o perfilInfo.seguidores cambie
 
    const fetchUserData = async (userIds, setUserData) => {
        try {
            const userData = await Promise.all(userIds.map(async (userId) => {
                
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + userId.id);
                const data = await response.json();
                return data;
            }));
            setUserData(userData);
            
        } catch (error) {
            console.error('Error al obtener información del usuario:', error);
        }
    };

    const handleFollowersModalShow = () =>setShowFollowersModal(true);
    const handleFollowingModalShow = () =>  setShowFollowingModal(true);
    const handleFollowersModalClose = () => setShowFollowersModal(false);
    const handleFollowingModalClose = () => setShowFollowingModal(false);
    const handleUnfollowConfirmModalClose = () => setShowUnfollowConfirmModal(false);


    const [tipoMediaSeleccionada, setTipoMediaSeleccionada] = useState("pelicula");

    const filtrarReviewsPorTipo = (tipo) => {
        if (perfilInfo && perfilInfo.reviews) {
            return perfilInfo.reviews.filter((review) => review.media.tipo === tipo);
        } else {
            return [];
        }
    };

    const calcularNotaMedia = (reviews) => {
        if (reviews.length === 0) {
            setNotaMedia(0);
            return;
        }
        const sumaCalificaciones = reviews.reduce((sum, review) => sum + review.calificacion, 0);
        const media = sumaCalificaciones / reviews.length;
        setNotaMedia(media);
    };

    const fechaNacimiento = new Date(perfilInfo?.fechaNacimiento);
    const dia = fechaNacimiento.getDate();
    const mes = fechaNacimiento.getMonth() + 1;
    const año = fechaNacimiento.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${año}`;
    const session = useSession();

    
    const handleFollow = async (idUsuario) => {
        
        try {
            // Llamar a la API para seguir al usuario con el ID especificado
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${session.data.user.id}/seguidores`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.data.user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idUsuario: idUsuario }) // Pasar el ID de usuario como un objeto JSON con la clave idUsuario
            });
    
            // Dentro de la función handleFollow
            if (response.ok) {
                setShowFollowersModal(false);
                // Buscar el nombre de usuario en followersData
                var follower = followersData.find(user => user._id === idUsuario);

                if(perfilInfo._id !== session.data?.user.id){
                    follower = perfilInfo;
                }
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
                                Has empezado a seguir a {follower.username}
                            </Toast.Body>
                            <CloseButton
                                className="me-2 m-auto"
                                variant="white"
                                onClick={closeToast}
                            />
                        </Stack>
                    </Toast>
                );

                // Si la solicitud fue exitosa, actualizamos primero perfilInfo haciendo una nueva solicitud al servidor
                fetch(endpointGetPerfil)
                    .then((response) => response.json())
                    .then((data) => {
                        setPerfilInfo(data);
                    })
                    .catch((error) => {
                        console.error('Error al obtener la información del perfil:', error);
                        
                    });
                // Resto del código
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
                                Error al seguirlo
                            </Toast.Body>
                            <CloseButton
                                className="me-2 m-auto"
                                variant="white"
                                onClick={closeToast}
                            />
                        </Stack>
                    </Toast>
                );
                // Manejar errores si la solicitud no fue exitosa
                console.error('Error al intentar seguir al usuario:', response.statusText);
                // Manejar el error de acuerdo a tu lógica de la aplicación

            }
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error('Error de red:', error.message);
            // Manejar el error de acuerdo a tu lógica de la aplicación
        }
    };
    
    const handleUnfollow = async (idUsuario) => {
        
        setShowUnfollowConfirmModal(false);
        try {
            // Llamar a la API para dejar de seguir al usuario con el ID especificado
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${session.data.user.id}/seguidores`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${session.data.user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idUsuario: idUsuario }) // Pasar el ID de usuario como un objeto JSON con la clave idUsuario
            });
    
            // Dentro de la función handleUnfollow
            if (response.ok) {
                setShowFollowersModal(false);
                setShowFollowingModal(false);
                var following = followingData.find(user => user._id === idUsuario);

                if(perfilInfo._id !== session.data?.user.id){
                    following = perfilInfo;
                }
    
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
                                Has dejado de seguir a {following.username}
                            </Toast.Body>
                            <CloseButton
                                className="me-2 m-auto"
                                variant="white"
                                onClick={closeToast}
                            />
                        </Stack>
                    </Toast>
                );
                // Si la solicitud fue exitosa, actualizamos primero perfilInfo haciendo una nueva solicitud al servidor
                fetch(endpointGetPerfil)
                    .then((response) => response.json())
                    .then((data) => {
                        setPerfilInfo(data);
                    })
                    .catch((error) => {
                        console.error('Error al obtener la información del perfil:', error);

                    });
                // Resto del código
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
                                Error al dejar de seguirlo
                            </Toast.Body>
                            <CloseButton
                                className="me-2 m-auto"
                                variant="white"
                                onClick={closeToast}
                            />
                        </Stack>
                    </Toast>);
                // Manejar errores si la solicitud no fue exitosa
                console.error('Error al intentar dejar de seguir al usuario:', response.statusText);
                // Manejar el error de acuerdo a tu lógica de la aplicación
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error('Error de red:', error.message);
            // Manejar el error de acuerdo a tu lógica de la aplicación
        }
    };

    const FollowersModal = ({ show, handleClose, followers, followingData }) => (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Seguidores</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    followers.length > 0 ? (
                        <ListGroup>
                            {followers.map((follower, index) => {
                                // Verificar si el ID del seguidor está en la lista de usuarios seguidos
                                
                                
                                const isFollowing = followingData.map(follow => follow._id).includes(follower._id);
                                return (
                                    <ListGroup.Item key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ marginRight: '20px' }}>
                                                <div style={{ overflow: 'hidden', width: '50px', height: '50px', borderRadius: '50%' }}>
                                                    <img src={follower.imagen ? follower.imagen : 'https://w7.pngwing.com/pngs/1000/665/png-transparent-computer-icons-profile-s-free-angle-sphere-profile-cliparts-free.png'} alt="Imagen de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <Link
                                                    className="text-decoration-none"
                                                    href={"/perfil/" + follower._id}
                                                    passHref
                                                >
                                                    <span className="text-primary">@{follower.username}</span>
                                                </Link>
                                                <div>{follower.descripcion}</div>
                                            </div>
                                        </div>
                                        {/* Botón "Siguiendo" solo si se sigue al usuario */}
                                        {perfilInfo._id === session.data?.user.id && (
                                            <div>
                                                {isFollowing ? (
                                                    <Button variant="primary" onClick={() => { setUnfollowUserId(follower._id); setShowUnfollowConfirmModal(true); }}>Siguiendo</Button>
                                                ) : (
                                                    <Button variant="outline-primary" onClick={() => handleFollow(follower._id)}>Seguir</Button>
                                                )}
                                            </div>
                                        )}
                                        
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    ) : (
                        <div>
                            {perfilInfo._id === session.data?.user.id ? (
                                <p>No tienes seguidores.</p>
                            ) : (
                                <p>No tiene seguidores.</p>
                            )}
                        </div>
                    )
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
    
    const FollowingModal = ({ show, handleClose, following }) => (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Seguidos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    following.length > 0 ? (
                        <ListGroup>
                            {following.map((follow, index) => (
                                <ListGroup.Item key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ marginRight: '20px' }}>
                                            <div style={{ overflow: 'hidden', width: '50px', height: '50px', borderRadius: '50%' }}>
                                                <img src={follow.imagen ? follow.imagen : 'https://w7.pngwing.com/pngs/1000/665/png-transparent-computer-icons-profile-s-free-angle-sphere-profile-cliparts-free.png'} alt="Imagen de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <Link
                                                className="text-decoration-none"
                                                href={"/perfil/" + follow._id}
                                                passHref
                                            >
                                                <span className="text-primary">@{follow.username}</span>
                                            </Link>
                                            <div>{follow.descripcion}</div>
                                        </div>
                                    </div>
                                    {perfilInfo._id === session.data?.user.id && (
                                         <Button variant="primary" onClick={() => { setUnfollowUserId(follow._id); setShowUnfollowConfirmModal(true); }}>Siguiendo</Button>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <div>
                            {perfilInfo._id === session.data?.user.id ? (
                                <p>No sigues a nadie.</p>
                            ) : (
                                <p>No sigue a nadie.</p>
                            )}
                        </div>
                    )
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
    
    const UnfollowConfirmModal = ({ show, handleClose, handleConfirm }) => (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que deseas dejar de seguir a este usuario?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );

    const PerfilContent = () => {
        const reviewsFiltradas = filtrarReviewsPorTipo(tipoMediaSeleccionada);
        const imAFollowing = followersData.map(follow => follow._id).includes(session.data?.user.id);
        
        return (
            <>
                <h1 className="d-none d-sm-block fw-semibold">{'@' + perfilInfo.username}</h1>
                <hr className="d-none d-sm-block border-2" />
                <Card.Body>
                    <Row>
                        <Col md={4} className="text-center">
                            <div className="mb-3">
                                <Image
                                    src={perfilInfo.imagen || 'https://w7.pngwing.com/pngs/1000/665/png-transparent-computer-icons-profile-s-free-angle-sphere-profile-cliparts-free.png'}
                                    roundedCircle
                                    style={{ width: '150px', height: '150px' }}
                                />
                            </div>
                            <h4>{perfilInfo.username}</h4>
                            <p>
                                <span className="text-primary" onClick={handleFollowersModalShow} style={{ cursor: 'pointer' }}>
                                    {perfilInfo.seguidores ? perfilInfo.seguidores.length : 0}
                                </span> Seguidores
                                <span className="text-primary ms-2" onClick={handleFollowingModalShow} style={{ cursor: 'pointer' }}>
                                    {perfilInfo.seguidos ? perfilInfo.seguidos.length : 0}
                                </span> Seguidos
                            </p>
                            <div className="d-flex justify-content-center align-items-center">
                                <Estrellas calificacion={notaMedia} />
                                <span className="text-primary ms-2" style={{ fontSize: '30px' }}>
                                    {perfilInfo.reviews && perfilInfo.reviews.calificacion !== undefined 
                                            ? perfilInfo.reviews.calificacion 
                                            : notaMedia.toFixed(1)}
                                </span>
                            </div>
                        </Col>
                        <Col md={8}>
                            <p><span className="text-primary">Descripción: </span> {perfilInfo.descripcion}</p>
                            <p><span className="text-primary">Fecha de nacimiento: </span> {fechaFormateada}</p>
                            <p>
                                <span className="text-primary">Número de valoraciones: </span>
                                {perfilInfo.reviews ? perfilInfo.reviews.length : 0}
                            </p>
                            <div>
                                {perfilInfo._id === session.data?.user.id ? (
                                    <Link href={"/editarPerfil/" + perfilInfo._id} passHref>
                                        <Button variant="primary" className="w-100">Editar perfil</Button>
                                    </Link>
                                ) : (
                                    <div>
                                        {imAFollowing ? (
                                            <Button variant="primary" className="w-50" onClick={() => { setUnfollowUserId(id); setShowUnfollowConfirmModal(true); }}>Siguiendo</Button>
                                        ) : (
                                            <Button variant="outline-primary" className="w-50" onClick={() => handleFollow(id)}>Seguir</Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
                <hr className="d-none d-sm-block border-2" />
                <h2 className="fs-sm-3 fw-semibold">Reviews</h2>
                <ToggleButtonGroup
                    type="radio"
                    name={"options_horizontal"}
                    onChange={(v) => setTipoMediaSeleccionada(v)}
                    value={tipoMediaSeleccionada}
                    className="d-none d-sm-flex mb-3"
                >
                    <ToggleButton variant="outline-primary" id={"pelicula_"} value="pelicula">Películas</ToggleButton>
                    <ToggleButton variant="outline-primary" id={"libro_"} value="libro">Libros</ToggleButton>
                    <ToggleButton variant="outline-primary" id={"videojuego"} value="videojuego">Videojuegos</ToggleButton>
                    <ToggleButton variant="outline-primary" id={"musica"} value="musica">Música</ToggleButton>
                </ToggleButtonGroup>
                {reviewsFiltradas.length > 0 ? (
                    reviewsFiltradas.map((r) => (
                        <ReviewGrande key={r.id} r={r} miPerfil={perfilInfo._id === session.data?.user.id} updateReview={fetchPerfilInfo}/>
                    ))
                ) : (
                    <Row className="py-5 text-center justify-content-center">
                        <Col md={4}>
                            <p className="fs-5">No hay ninguna reseña de este tipo</p>
                        </Col>
                    </Row>
                )}
                <hr className="border-2 text-body-tertiary" />
            </>
        );
    };

    if (session.status !== "loading" && perfilInfo !== undefined) return (
        <>
            <CustomNavbar isLogged={true} />
            <CardCentral Content={<PerfilContent />} />
            <FollowersModal 
                show={showFollowersModal}
                handleClose={handleFollowersModalClose} 
                followers={followersData} 
                followingData={followingData} 
            />
            <FollowingModal
                show={showFollowingModal}
                handleClose={handleFollowingModalClose}
                following={followingData}
            />
            <UnfollowConfirmModal 
                show={showUnfollowConfirmModal}
                handleClose={handleUnfollowConfirmModalClose}
                handleConfirm={() => handleUnfollow(unfollowUserId)}
            />
        </>
    )
    else return (<Loader/>)
}

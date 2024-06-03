"use client";
import CustomNavbar from "../(components)/navbar";
import CardCentral from "../(components)/cardCentral";
import { Suspense, useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import Carousel from "react-bootstrap/Carousel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Toast } from "react-bootstrap";
import { useEasyToast } from "easy-toast-react-bootstrap";
import { CloseButton } from "react-bootstrap";
import {Stack} from "react-bootstrap";

// Función para mostrar las estrellas de acuerdo a la puntuación
const Estrellas = ({ calificacion, onStarClick }) => {
    const [hoveredStar, setHoveredStar] = useState(null);

    // Función para manejar el clic en una estrella
    const handleClick = (star) => {
        // Si la estrella clicada ya está marcada, desmarcarla
        if (calificacion === star) {
            onStarClick(0); // Desmarcar estableciendo la puntuación a 0
        } else {
            // Si la estrella clicada no está marcada, marcarla
            onStarClick(star);
        }
    };

    return (
        <div className="rating me-2">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                const isHalfStar = hoveredStar !== null && hoveredStar === starValue - 0.5;
                const isFullStar = starValue <= calificacion;
                return (
                    <span
                        key={index}
                        onMouseEnter={() => setHoveredStar(starValue)}
                        onMouseLeave={() => setHoveredStar(null)}
                        onClick={() => handleClick(starValue)}
                        style={{
                            cursor: 'pointer',
                            fontSize: '40px',
                            color: isFullStar || isHalfStar ? '#007bff' : '#6c757d'
                        }}
                    >
                        {isFullStar ? '★' : '☆'}
                    </span>
                );
            })}
        </div>
    );
};



const reviews = [];

function NuevoReview() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showToast, closeToast] = useEasyToast();

    const idMedia = searchParams.get('idMedia')
    const tipoMedia = searchParams.get('tipoMedia')
    

    let endpointGetMedia = "";
    const [mediaInfo, setMediaInfo] = useState(undefined);
    const [review, setReview] = useState({})
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [rating, setRating] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [agregadas, setagregadas] = useState([]);
    const [predesagregadas, setPredesagregadas] = useState([]);
    const [buscadas, setBuscadas] = useState('');
    const [tipoMediaSeleccionada, setTipoMediaSeleccionada] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false); // Estado de carga
    const session = useSession();
    const urlPorMedia = {
        pelicula: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/peliculas`,
        musica: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/musica`,
        videojuego: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/videojuegos`,
        libro: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/libros`,
        // Quiza borrar la de abajo
        videojuegos: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/videojuegos`,
    }

    useEffect(() => {
        const obtenerMedia = async () => {
            const dirBusqueda = tipoMedia == "musica" ? urlPorMedia[tipoMedia]+"/album/"+idMedia : urlPorMedia[tipoMedia]+ "/"+idMedia
            
            fetch(dirBusqueda)
            .then((response) => response.json())
            .then((data) => {
                setMediaInfo(data)
                setReview ({
                    titulo: data.nombre,
                    descripcion: '',
                    nota: '',
                })
            });
        }

        
        obtenerMedia()
    
    }, []);

    if(mediaInfo === undefined) return;

    

    // Dentro del componente donde está el botón
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReview({ ...review, [name]: value });
    };
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        
    };

    const handleBuscadasChange = (e) => {
        setBuscadas(e.target.value);
    };

    const handleAddToReviews = (item) => {
        
        // Verificar si la película ya está en selectedItems o agregadas
        const alreadySelected = selectedItems.some(selectedItem => selectedItem.id === item.id);
        const alreadyAdded = agregadas.some(addedItem => addedItem.id === item.id);
        
        // Solo añadir la película si no está en ninguna de las listas
        if (!alreadySelected && !alreadyAdded) {
            setSelectedItems([...selectedItems, item]);
        } else {
            
        }
    };
    

    const handleSearch = () => {
        const params = new URLSearchParams({ titulo: buscadas });
        const endpointGetSearch = `${urlPorMedia[tipoMediaSeleccionada]}/search`;
        
        fetch(`${endpointGetSearch}?${params}`)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
            })
            .catch((error) => {
                console.error('Error al buscar libros:', error);
            });
    };

    const handleOpenModal = (tipo) => {
        
        setTipoMediaSeleccionada(tipo); // Establece el tipo de formulario
        setBuscadas('');           
        setLoading(true); // Inicia la carga
        setShowSearchModal(true); // Muestra el modal
        const endpointGet = `${urlPorMedia[tipo]}`;
        
        fetch(endpointGet)
            .then((response) => response.json())
            .then((data) => {
                
                setSearchResults(data); // Actualiza los resultados de la búsqueda
                setLoading(false); // Finaliza la carga

                
            })
            .catch((error) => {
                console.error('Error al obtener los datos:', error);
                setLoading(false); // Finaliza la carga en caso de error
            });
    };
    

    const handleSaveSelections = () => {
        // Filtrar las películas que estaban en agregadas pero no están en predesagregadas
        const updatedAgregadas = agregadas.filter(item => !predesagregadas.some(predesagregada => predesagregada.id === item.id));
        // Agregar las selectedItems
        const newAgregadas = [...updatedAgregadas, ...selectedItems];
        // Actualizar el estado de agregadas y predesagregadas
        setagregadas(newAgregadas);
        setSelectedItems([]);
        setShowSearchModal(false);
        setPredesagregadas([]);
    };
    

    const handleCancel = () => {
        setSelectedItems([]);
        setShowSearchModal(false);
        setPredesagregadas([]);
    };

    

    const crearReseña = async () => {
        
        
        const reviewData = {
            media: {
                tipo: tipoMedia, // Tipo de media seleccionada (e.g., 'pelicula', 'juego', etc.)
                idMedia: idMedia, // ID de la media seleccionada
            },
            descripcion: review.descripcion, // Descripción de la reseña ingresada por el usuario
            calificacion: rating, // Calificación ingresada por el usuario
            mediaRecuerda: agregadas.map((a) => {return {
                ...a,
                idMedia: a.id
            }}), // Opcional: otra media que recuerda la actual
        };
        
        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${session.data.user.id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.data.user.token}`
                },
                body: JSON.stringify(reviewData)
            });
    
            if (!response.ok) {
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
                    </Toast>)
            }
            else {
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
                                Reseña añadida correctamente
                            </Toast.Body>
                            <CloseButton
                                className="me-2 m-auto"
                                variant="white"
                                onClick={closeToast}
                            />
                        </Stack>
                    </Toast>
                );
                router.back()
            }
    
            const result = await response.json();
            
        } catch (error) {
            console.error('Error al crear la reseña:', error);
            //setErrorMessage(error.message);
        }
    };

    // Función para manejar el cambio de estado de los acordeones
    const handleAccordionClick = (eventKey) => {
        const index = activeItems.indexOf(eventKey);
        if (index === -1) {
            // Si el acordeón no está en la lista de activos, agregarlo
            setActiveItems([...activeItems, eventKey]);
        } else {
            // Si el acordeón ya está en la lista de activos, quitarlo
            setActiveItems(activeItems.filter(item => item !== eventKey));
        }
    };

    const handleRemoveFromSelected = (itemToRemove) => {
        setSelectedItems(prevSelected => prevSelected.filter(item => item.id !== itemToRemove.id));
    };

    const handleMoveToPredesagregadas = (itemToRemove) => {
        setPredesagregadas(prevPredesagregadas => [...prevPredesagregadas, itemToRemove]);
    };

    const handleStarClick = (value) => {
        setRating(value); // Actualizar el estado de la calificación
        setReview({ ...review, nota: value.toString() }); // Actualizar el estado de la reseña con la nueva nota
    };

   if (session.status === "authenticated") return (
        <>
            <Suspense>
            <CustomNavbar isLogged={true} />
            <CardCentral Content={
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-sm-12 col-md-6">
                            <h1>{review.titulo}</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="form-label">Opinion</label>
                                    <textarea
                                        className="form-control"
                                        id="descripcion"
                                        rows={3}
                                        placeholder="Descripción de la reseña"
                                        name="descripcion"
                                        value={review.descripcion}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <Estrellas calificacion={rating} onStarClick={(value) => handleStarClick(value)} />
                                </div>
                            </form>
                        </div>
                        <div className="col-sm-12 col-md-6 text-center">
                            <img
                                src={mediaInfo.imagen}
                                alt={mediaInfo.nombre}
                                style={{ maxWidth: '70%', marginBottom: '20px' }}
                            />
                        </div>
                    </div>
                    <hr className="d-none d-sm-block border-2" />
                    <h3>Le recuerda a:</h3>
                    <div className="mb-3 text-center">
                        
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Películas seleccionadas</Accordion.Header>
                            <Accordion.Body>
                                {/* Contenido de películas seleccionadas */}
                                {agregadas.filter(item => item.tipo === 'pelicula').length > 0 && (
                                    <Carousel interval={null} data-bs-theme="dark">
                                            {agregadas.filter(item => item.tipo === 'pelicula').map((review, index) => (
                                                <Carousel.Item key={index}>
                                                    <Row className="py-4 justify-content-center">
                                                        <Col xs={7} md={2}>
                                                            <Image fluid src={review.imagen} />
                                                        </Col>
                                                    </Row>
                                                    <Row className="pb-5 text-center justify-content-center">
                                                        <Col md={4}>{review.nombre}</Col>
                                                    </Row>
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    )}
                                    <Button variant="primary" onClick={() => handleOpenModal('pelicula')}>
                                        Añadir Pelicula
                                    </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <Accordion>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Música seleccionada</Accordion.Header>
                            <Accordion.Body>
                                {/* Contenido de música seleccionada */}
                                {agregadas.filter(item => item.tipo === 'musica').length > 0 && (
                                    <Carousel interval={null} data-bs-theme="dark">
                                        {agregadas.filter(item => item.tipo === 'musica').map((review, index) => (
                                            <Carousel.Item key={index}>
                                                <Row className="py-4 justify-content-center">
                                                    <Col xs={7} md={2}>
                                                        <Image fluid src={review.imagen} />
                                                    </Col>
                                                </Row>
                                                <Row className="pb-5 text-center justify-content-center">
                                                    <Col md={4}>{review.nombre}</Col>
                                                </Row>
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                )}
                                    <Button variant="primary" onClick={() => handleOpenModal('musica')}>
                                        Añadir Música
                                    </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <Accordion>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Videojuegos seleccionados</Accordion.Header>
                            <Accordion.Body>

                                {agregadas.filter(item => item.tipo === 'videojuego').length > 0 && (
                                <Carousel interval={null} data-bs-theme="dark">
                                        {agregadas.filter(item => item.tipo === 'videojuego').map((review, index) => (
                                            <Carousel.Item key={index}>
                                                <Row className="py-4 justify-content-center">
                                                    <Col xs={7} md={2}>
                                                        <Image fluid src={review.imagen} />
                                                    </Col>
                                                </Row>
                                                <Row className="pb-5 text-center justify-content-center">
                                                    <Col md={4}>{review.nombre}</Col>
                                                </Row>
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                    )}
                                    <Button variant="primary" onClick={() => handleOpenModal('videojuego')}>
                                        Añadir Videojuego
                                    </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    <Accordion>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Libros seleccionados</Accordion.Header>
                            <Accordion.Body>
                                {/* Contenido de libros seleccionados */}
                                {agregadas.filter(item => item.tipo === 'libro').length > 0 && (
                                <Carousel interval={null} data-bs-theme="dark">
                                        {agregadas.filter(item => item.tipo === 'libro').map((review, index) => (
                                            <Carousel.Item key={index}>
                                                <Row className="py-4 justify-content-center">
                                                    <Col xs={7} md={2}>
                                                        <Image fluid src={review.imagen} />
                                                    </Col>
                                                </Row>
                                                <Row className="pb-5 text-center justify-content-center">
                                                    <Col md={4}>{review.nombre}</Col>
                                                </Row>
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>)}
                                    <Button variant="primary" onClick={() => handleOpenModal('libro')}>
                                        Añadir Libro
                                    </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    </div>
                    
                        <Button
                            variant="primary"
                            onClick={crearReseña}
                            className="w-100"
                        >
                            Crear Reseña
                        </Button>
                </div>
    
            } />
            <Modal show={showSearchModal} onHide={handleCancel} size="xl">
                <Modal.Header closeButton onClick={handleCancel}>
                    <Modal.Title>Añadir {tipoMediaSeleccionada.charAt(0).toUpperCase() + tipoMediaSeleccionada.slice(1)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Modal.Header className="d-flex justify-content-center align-items-center">
                            <Modal.Title>Buscador de {tipoMediaSeleccionada.charAt(0).toUpperCase() + tipoMediaSeleccionada.slice(1)}</Modal.Title>
                        </Modal.Header>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Buscar..."
                                className="me-2"
                                aria-label="Search"
                                value={buscadas}
                                onChange={handleBuscadasChange}
                            />
                            <Button variant="outline-primary" onClick={handleSearch}>Buscar</Button>
                        </Form>
                        <div className="mt-3 d-flex flex-wrap"> 
                        {loading ? (
                            <div>Cargando...</div>
                        ) : ( 
                            <>
                                {searchResults.slice(0, 7).map((item, index) => (
                                    <div key={index} className="mb-3 me-3" style={{ width: '135px' }}>
                                        <Image
                                            src={item.imagen}
                                            alt={item.nombre}
                                            style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                                            onClick={() => handleAddToReviews(item)}
                                        />
                                        <div className="text-center mt-2" style={{ fontSize: '1rem' }}>{item.nombre}</div>
                                    </div>
                                ))}

                            </>
                        )}
                        </div>
                    </div>
                    <hr className="d-none d-sm-block border-2" />
                    <div className="mb-3">
                        <Modal.Header className="d-flex justify-content-center align-items-center">
                            <Modal.Title>Selecciones</Modal.Title>
                        </Modal.Header>
                        <div className="d-flex flex-wrap">
                            {/* Muestra las seleccionadas */}
                            {selectedItems.map((item, index) => (
                                <div key={index} className="mb-3 me-3" style={{ width: '135px' }}>
                                    <Image
                                        src={item.imagen}
                                        alt={item.nombre}
                                        style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                                        onClick={() => handleRemoveFromSelected(item)}
                                    />
                                    <div className="text-center mt-2" style={{ fontSize: '1.2rem' }}>{item.nombre}</div>
                                </div>
                            ))}
                            {agregadas.filter(item => item.tipo === tipoMediaSeleccionada && !predesagregadas.some(predesagregada => predesagregada.id === item.id)).map((item, index) => (
                                <div key={index} className="mb-3 me-3" style={{ width: '135px' }}>
                                    <Image
                                        src={item.imagen}
                                        alt={item.nombre}
                                        style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                                        onClick={() => handleMoveToPredesagregadas(item)}
                                    />
                                    <div className="text-center mt-2" style={{ fontSize: '1.2rem' }}>{item.nombre}</div>
                                </div>
                            ))}

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSaveSelections}>Guardar</Button>
                </Modal.Footer>
            </Modal>
            </Suspense>
        </>
    );
}

export default function NuevoReviewPage(){
    return (
    <Suspense>
        <NuevoReview/>
    </Suspense>)
}

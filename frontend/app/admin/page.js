"use client";
import CustomNavbar from "../(components)/navbar";
import CardCentral from "../(components)/cardCentral";
import ReviewGrande from "../(components)/reviewGrande";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default function Dashboard() {
    const [usuariosInfo, setUsuariosInfo] = useState([]);
    const [reviewsInfo, setReviewsInfo] = useState([]);
    const [estadisticasUsuariosInfo, setEstadisticasUsuariosInfo] = useState([]);
    const [estadisticasReviewsInfo, setEstadisticasReviewsInfo] = useState([]);
    const [view, setView] = useState("usuarios");

    const endpointGetUsuarios = process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/";
    const endpointGetReviews = process.env.NEXT_PUBLIC_BACKEND_URL + "api/reviews/";
    const endpointGetEstadisticasUsuarios = process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/numUsersFecha";
    const endpointGetEstadisticasReviews = process.env.NEXT_PUBLIC_BACKEND_URL + "api/reviews/numReviewsFecha";
    const endpointEliminarReview = process.env.NEXT_PUBLIC_BACKEND_URL + "api/reviews/";
    const endpointGetUsuariosSearch = process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/buscar/usuario";
    const endpointBanearUsuario = process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/banear/";
    const endpointDesbanearUsuario = process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/desbanear/";


    useEffect(() => {
        if (view === "usuarios") {
            fetchUsuarios();
        } else if (view === "reviews") {
            fetchReviews();
        } else if (view === "estadisticas") {
            fetchEstadisticas();
        }
    }, [view]);

    const eliminarReviewPorId = (reviewId) => {
        fetch(`${endpointEliminarReview}${reviewId}`, { method: 'DELETE' })
            .then((response) => response.json())
            .then(() => fetchReviews())
            .catch((error) => console.error('Error al eliminar la review:', error));
    };
    
    const fetchUsuarios = () => {
        fetch(endpointGetUsuarios)
            .then((response) => response.json())
            .then((data) => {
                if (data && Array.isArray(data.usuarios)) {
                    setUsuariosInfo(data.usuarios);
                } else {
                    console.error('La respuesta de usuarios no contiene un array válido:', data);
                }
            })
            .catch((error) => {
                console.error('Error al obtener los usuarios:', error);
            });
    };

    const fetchReviews = () => {
        fetch(endpointGetReviews)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data.reviews)) {
                    
                    setReviewsInfo(data.reviews);
                } else {
                    console.error('La respuesta de reviews no es un array:', data);
                }
            })
            .catch((error) => {
                console.error('Error al obtener las reviews:', error);
            });
    };

    const fetchEstadisticas = () => {
        fetch(endpointGetEstadisticasUsuarios)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setEstadisticasUsuariosInfo(data);
                } else {
                    console.error('La respuesta de estadísticas de usuarios no es un array:', data);
                }
            })
            .catch((error) => {
                console.error('Error al obtener las estadísticas de usuarios:', error);
            });

        fetch(endpointGetEstadisticasReviews)
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setEstadisticasReviewsInfo(data);
                } else {
                    console.error('La respuesta de estadísticas de reviews no es un array:', data);
                }
            })
            .catch((error) => {
                console.error('Error al obtener las estadísticas de reviews:', error);
            });
    };

    const handleSearch = (e) => {
        
        e.preventDefault()
        const searchTerm = e.target.FormNombreUsuario.value;
        fetch(`${endpointGetUsuariosSearch}?nombreUsuario=${searchTerm}`)
            .then((response) => response.json())
            .then((data) => {
                if (data && Array.isArray(data)) {
                    
                    setUsuariosInfo(data.map((u) => {
                        return {
                            ...u,
                            _id: u.id
                        }
                    }));
                } else {
                    console.error('La respuesta de búsqueda de usuarios no contiene un array válido:', data);
                }
            })
            .catch((error) => {
                console.error('Error al buscar usuarios:', error);
            });
    };

    const handleViewChange = (newView) => {
        setView(newView);
    };

    const banearUsuarioPorId = (id) => {
        fetch(`${endpointBanearUsuario}${id}`, { method: 'POST' })
            .then((response) => response.json())
            .then(() => fetchUsuarios())
            .catch((error) => console.error('Error al banear el usuario:', error));
        };
    
        const desbanearUsuarioPorId = (id) => {
            fetch(`${endpointDesbanearUsuario}${id}`, { method: 'POST' })
                .then((response) => response.json())
                .then(() => fetchUsuarios())
                .catch((error) => console.error('Error al desbanear el usuario:', error));
        };
    
        const UsuariosPage = () => (
            <>
                <h1 className="d-none d-sm-block fw-semibold">Usuarios</h1>
                <hr className="d-none d-sm-block border-2" />
                <h2 className="fs-sm-3 fw-semibold">Buscador de usuarios</h2>
                <Form onSubmit={handleSearch}>
                    <div className="pt-1 w-full d-flex flex-column flex-sm-row gap-2 gap-sm-3">
                        <div className="flex-fill">
                            <Form.Label htmlFor="FormNombreUsuario" visuallyHidden>
                                Nombre del usuario
                            </Form.Label>
                            <Form.Control
                                id="FormNombreUsuario"
                                placeholder="Buscar por nombre"
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <Button type="submit">
                                Buscar
                            </Button>
                        </div>
                    </div>
                </Form>
                <hr className="border-2 text-body-tertiary" />
                {usuariosInfo.length > 0 ? (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Correo</th>
                                <th>Banear/Desbanear</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosInfo.map((u) => (
                                <UsuarioItem key={u._id} usuario={u} banearUsuarioPorId={banearUsuarioPorId} desbanearUsuarioPorId={desbanearUsuarioPorId} />
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>No se encontraron usuarios.</p>
                )}
            </>
        );
    
        const ReviewsPage = () => {
            return (
                <>
                    <h1 className="d-none d-sm-block fw-semibold">Reviews</h1>
                    <hr className="d-none d-sm-block border-2" />
                    <h3 className="fw-semibold">Últimas reviews</h3>
                    {reviewsInfo.length > 0 ? (
                        reviewsInfo.map((r) => (
                            <ReviewGrande key={r.id} r={r} miPerfil={true} updateReview={() => fetchReviews()} />
                        ))
                    ) : (
                        <p>No se encontraron reviews.</p>
                    )}
                </>
            );
        };
    
        const EstadisticasPage = () => {
            const labelsUsuarios = estadisticasUsuariosInfo.map((data) => data._id);
            const dataUsuarios = estadisticasUsuariosInfo.map((data) => data.count);
            const chartDataUsuarios = {
                labels: labelsUsuarios,
                datasets: [
                    {
                        label: "Número de usuarios",
                        data: dataUsuarios,
                        fill: false,
                        borderColor: "rgb(75, 192, 192)",
                        tension: 0.1
                    }
                ]
            };
        
            const labelsReviews = estadisticasReviewsInfo.map((data) => data._id);
            const dataReviews = estadisticasReviewsInfo.map((data) => data.count);
            const chartDataReviews = {
                labels: labelsReviews,
                datasets: [
                    {
                        label: "Número de reviews",
                        data: dataReviews,
                        fill: false,
                        borderColor: "rgb(54, 162, 235)",
                        tension: 0.1
                    }
                ]
            };
            
            const chartOptionsUsers = {
                plugins: {
                    title: {
                        display: true,
                        text: "Gráfico de usuarios por fecha",
                        font: {
                            size: 20
                        }
                    }
                }
            };
            
        const chartOptionsReviews = {
            plugins: {
                title: {
                    display: true,
                    text: "Gráfico de reviews por fecha",
                    font: {
                        size: 20
                    }
                }
            }
        };
        
            return (
                <>
                    <h1 className="d-none d-sm-block fw-semibold">Estadísticas</h1>
                    <hr className="d-none d-sm-block border-2" />
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ height: "600px", width: "800px", marginBottom: "20px" }}>
                            <Line data={chartDataUsuarios} options={chartOptionsUsers} />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ height: "600px", width: "800px" }}>
                            <Line data={chartDataReviews} options={chartOptionsReviews} />
                        </div>
                    </div>
                </>
            );
        };
        
        
    
        const renderContent = () => {
            if (view === "usuarios") return <UsuariosPage />;
            if (view === "reviews") return <ReviewsPage />;
            if (view === "estadisticas") return <EstadisticasPage />;
        };
    
        return (
            <>
                <CustomNavbar isLogged={true} />
                <CardCentral Content={
                    <>
                        <div className="d-flex justify-content-around mb-4">
                            <Button variant="outline-primary" onClick={() => handleViewChange("usuarios")}>
                                Usuarios
                            </Button>
                            <Button variant="outline-primary" onClick={() => handleViewChange("reviews")}>
                                Reviews
                            </Button>
                            <Button variant="outline-primary" onClick={() => handleViewChange("estadisticas")}>
                                Estadísticas
                            </Button>
                        </div>
                        {renderContent()}
                    </>
                } />
            </>
        );
    }
    
    function UsuarioItem({ usuario, banearUsuarioPorId, desbanearUsuarioPorId }) {
        const { _id, username, email, baneado } = usuario;
    
        const handleBanToggle = () => {
            if (baneado) {
                desbanearUsuarioPorId(_id);
            } else {
                banearUsuarioPorId(_id);
            }
        };
    
        return (
            <tr>
                <td>{username}</td>
                <td>{email}</td>
                <td>
                    <Button onClick={handleBanToggle} variant={baneado ? "danger" : "primary"}>
                        {baneado ? "Desbanear" : "Banear"}
                    </Button>
                </td>
            </tr>
        );
    }
    
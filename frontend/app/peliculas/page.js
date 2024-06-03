"use client";
import CustomNavbar from "../(components)/navbar";
import CardCentral from "../(components)/cardCentral";
import ReviewGrande from "../(components)/reviewGrande";
import MediaPequena from "../(components)/mediaPequena";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import Loader from "../(components)/loader";

export default function Pelicula() {
    const [peliculaInfo, setPeliculaInfo] = useState([]);
    const [loading, setLoading] = useState(true);

    const endpointGetPelicula =
        process.env.NEXT_PUBLIC_BACKEND_URL + "api/peliculas";
    const endpointGetPeliculaSearch =
        process.env.NEXT_PUBLIC_BACKEND_URL + "api/peliculas/search";

    useEffect(() => {
        fetchPelicula();
    }, []);

    const fetchPelicula = () => {
        setLoading(true);
        fetch(endpointGetPelicula)
            .then((response) => response.json())
            .then((data) => {
                setPeliculaInfo(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener los peliculas:", error);
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        const searchTerm = e.target.FormTituloAlbum.value;
        fetch(`${endpointGetPeliculaSearch}?titulo=${searchTerm}`)
            .then((response) => response.json())
            .then((data) => {
                setPeliculaInfo(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al buscar peliculas:", error);
                setLoading(false);
            });
    };

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const PeliculaPage = () => {
        return (
            <>
                <h1 className="d-none d-sm-block fw-semibold">RemindsMeOf</h1>
                <hr className="d-none d-sm-block border-2" />
                <h2 className="fs-sm-3 fw-semibold">Buscador de películas</h2>
                <Form onSubmit={handleSearch}>
                    <div className="pt-1 w-full d-flex flex-column flex-sm-row gap-2 gap-sm-3">
                        <div className="flex-fill">
                            <Form.Label
                                htmlFor="FormTituloAlbum"
                                visuallyHidden
                            >
                                Título del álbum
                            </Form.Label>
                            <Form.Control
                                id="FormTituloAlbum"
                                placeholder="Buscar por título"
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <Button type="submit">Buscar</Button>
                        </div>
                    </div>
                </Form>
                <hr className="border-2 text-body-tertiary" />

                {loading ? ( // Mostrar el Loader mientras se cargan los datos
                    <Loader />
                ) : (
                    peliculaInfo.map((p) => {
                        
                        return <MediaPequena key={p.id} m={p} />;
                    })
                )}
            </>
        );
    };

    return (
        <>
            <CustomNavbar isLogged={true} />
            <CardCentral Content={<PeliculaPage />} />
        </>
    );
}

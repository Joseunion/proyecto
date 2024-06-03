import React from 'react';
import { Card, Row, Col, Image, Button, CardBody } from 'react-bootstrap';
import Stack from "react-bootstrap/Stack";
import Link from "next/link";

const Perfil = ({ perfil }) => {
    // Verifica si notaMedia está definido
    if (!perfil || perfil.notaMedia === undefined) {
        console.error("notaMedia no está definido");
    }
    return (
        
            <Card.Body>
                <Row>
                    {/* Columna izquierda */}
                    <Col md={4} className="text-center">
                        {/* Foto de perfil */}
                        <div className="mb-3">
                            <Image
                                src={perfil.imgPerfil}
                                roundedCircle
                                style={{ width: '150px', height: '150px' }}
                            />
                        </div>
                        {/* Nombre del usuario */}
                        <h4>{perfil.id }</h4>
                        {/* Seguidores y seguidos */}
                        <p><span className="text-primary">{perfil.seguidores}</span> Seguidores   <span className="text-primary">{perfil.seguidos}</span> Seguidos</p>
                        {/* Nota media */}
                        <div className="d-flex justify-content-center align-items-center">
                            <Estrellas calificacion={perfil.notaMedia} />
                            <span className="text-primary ms-2" style={{ fontSize: '20px' }}>{perfil.notaMedia}</span>
                        </div>
                    </Col>


                    {/* Columna derecha */}
                    <Col md={8}>
                        {/* Descripción */}
                        <p><span className="text-primary">Descripción:</span> {perfil.descripcion}</p>
                        {/* Fecha de nacimiento */}
                        <p><span className="text-primary">Fecha de nacimiento:</span> {perfil.fechaNacimiento}</p>
                        {/* Número de valoraciones */}
                        <p><span className="text-primary">Número de valoraciones:</span> {perfil.valoraciones}</p>
                        {/* Botón de editar perfil */}
                        <Link href="/editarPerfil">
                            <Button variant="primary" className="w-100">Editar perfil</Button>
                        </Link>
                    </Col>



                </Row>
            </Card.Body>
        
    );
};

const Estrellas = ({ calificacion }) => {
    const numEstrellasCompleta = Math.trunc(calificacion);
    let mediaEstrella;
    if (numEstrellasCompleta == 0) mediaEstrella = calificacion % 1 == 0.5;
    else mediaEstrella = calificacion % numEstrellasCompleta == 0.5;
    let numEstrellasVacio = 5 - numEstrellasCompleta;
    if (mediaEstrella) numEstrellasVacio = numEstrellasVacio - 1;
    
    return (
        <Stack
            className="justify-content-center text-primary justify-content-sm-start"
            direction="horizontal"
            gap={1}
        >
            {[...Array(numEstrellasCompleta)].map((e, i) => (
                <i key={i} className="fa-solid fa-star text-primary"></i>
            ))}
            {mediaEstrella && (
                <i className="fa-solid fa-star-half-stroke text-primary"></i>
            )}
            {[...Array(numEstrellasVacio)].map((e, i) => (
                <i key={i} className="fa-regular fa-star text-primary"></i>
            ))}
        </Stack>
    );
};

export default Perfil;

"use client";
import CustomNavbar from "../../(components)/navbar";
import CardCentral from "../../(components)/cardCentral";
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function EditarPerfil({ params: { id } }) {
  const session = useSession();
  const endpointGetPerfil = process.env.NEXT_PUBLIC_BACKEND_URL + "api/users/" + id;

  const [perfilInfo, setPerfilInfo] = useState({
    username: '',
    fechaNacimiento: '',
    descripcion: '',
    imagen: '',
    reviews: []
  });

  const [fechaFormateada, setFechaFormateada] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(endpointGetPerfil)
      .then((response) => response.json())
      .then((data) => {
        setPerfilInfo(data);
        if (data.fechaNacimiento) {
          setFechaFormateada(data.fechaNacimiento.split('T')[0]); // Formato YYYY-MM-DD
        }
        
      })
      .catch((error) => {
        console.error('Error al obtener los datos del perfil:', error);
      });
  }, [endpointGetPerfil]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfilInfo({ ...perfilInfo, [name]: value });
    if (name === 'fechaNacimiento') {
      setFechaFormateada(value);
    }
  };

  const handleImageChange = (imageUrl) => {
    setPerfilInfo({ ...perfilInfo, imagen: imageUrl });
    
    setShowModal(false);
  };

  const formatearFecha = (fecha) => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const perfilConFechaFormateada = {
        ...perfilInfo,
        fechaNacimiento: formatearFecha(fechaFormateada),
      };
      
      
      
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${session.data.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.user.token}`
        },
        body: JSON.stringify({ username : perfilConFechaFormateada.username, descripcion : perfilConFechaFormateada.descripcion,
          fechaNacimiento : perfilConFechaFormateada.fechaNacimiento, imagen : perfilConFechaFormateada.imagen,
          email : perfilConFechaFormateada.email
         })
      });

      if (!response.ok) {
        throw new Error('Error al intentar modificar el perfil');
      }

      
      // Redirigir a la página del perfil después de guardar los cambios
      window.location.href = '/perfil/' + id; // Redirige a la página del perfil
    } catch (error) {
      console.error('Error al modificar el perfil:', error);
    }
  };

  return (
    <>
      <CustomNavbar isLogged={true} />
      <CardCentral Content={
        <div className="container">
          <h1>Editar Perfil</h1>
          <hr className="d-none d-sm-block border-2" />
          <div className="container d-flex justify-content-center align-items-center">
            <div className="position-relative d-inline-block">
              <img
                src={perfilInfo.imagen || "https://w7.pngwing.com/pngs/1000/665/png-transparent-computer-icons-profile-s-free-angle-sphere-profile-cliparts-free.png"}
                alt="Foto de Perfil"
                className="rounded-circle"
                style={{ width: '150px', height: '150px' }}
              />
              <label 
                htmlFor="inputFotoPerfil" 
                className="position-absolute" 
                style={{ top: '60%', left: '60%' }}
                onClick={() => setShowModal(true)}
              >
                <FontAwesomeIcon
                  icon={faCamera}
                  className="text-light"
                  style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                />
              </label>
            </div>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                name="username"
                value={perfilInfo.username}
                onChange={handleInputChange}
              />
            </Form.Group>
{/*             
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="text"
                placeholder="Contraseña"
                name="password"
                value={perfilInfo.password}
                onChange={handleInputChange}
              />
            </Form.Group> */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="text"
                placeholder="Correo electronico"
                name="email"
                value={perfilInfo.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formFechaNacimiento">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={fechaFormateada}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descripción"
                name="descripcion"
                value={perfilInfo.descripcion}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = '/perfil/' + id}>
                Cancelar
              </Button>
            </div>
          </Form>
        </div>
      } />
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Imagen de Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2919/2919906.png"
              alt="Imagen 1"
              className="img-thumbnail"
              style={{ width: '100px', cursor: 'pointer' }}
              onClick={() => handleImageChange("https://cdn-icons-png.flaticon.com/512/2919/2919906.png")}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/9368/9368199.png"
              alt="Imagen 2"
              className="img-thumbnail"
              style={{ width: '100px', cursor: 'pointer' }}
              onClick={() => handleImageChange("https://cdn-icons-png.flaticon.com/512/9368/9368199.png")}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/256/3135/3135768.png"
              alt="Imagen 3"
              className="img-thumbnail"
              style={{ width: '100px', cursor: 'pointer' }}
              onClick={() => handleImageChange("https://cdn-icons-png.flaticon.com/256/3135/3135768.png")}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/256/3135/3135823.png"
              alt="Imagen 4"
              className="img-thumbnail"
              style={{ width: '100px', cursor: 'pointer' }}
              onClick={() => handleImageChange("https://cdn-icons-png.flaticon.com/256/3135/3135823.png")}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

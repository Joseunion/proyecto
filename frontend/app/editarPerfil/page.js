// Agrega la línea siguiente al comienzo del archivo para marcarlo como un Client Component
"use client";
import CustomNavbar from "../(components)/navbar";
import CardCentral from "../(components)/cardCentral";
import React, { useState } from 'react';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function EditarPerfil() {
  const [perfil, setPerfil] = useState({
    nombre: '@PainHarold',
    fechaNacimiento: '11/03/1945',
    descripcion: '¡Hola! Soy Pain Harold, un apasionado crítico de cine.  En esta página encontrarás reseñas honestas y recomendaciones sobre las últimas películas. ¡Acompáñame en este viaje cinéfilo! ',
    fotoPerfil: 'https://www.laprensagrafica.com/export/sites/prensagrafica/img/2019/10/11/5d9f587b9a8cc_r_1570808835075_0-300-1080-1018_crop1570837000661.jpeg_324817014.jpeg',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfil({ ...perfil, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar los datos del perfil a tu servidor o almacenamiento.
    // Por ahora, solo imprimirlos en la consola.
    
    // Redirigir a la página del perfil después de guardar los cambios
    window.location.href = '/perfil'; // Redirige a la página del perfil
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
      src={perfil.fotoPerfil}
      alt="Foto de Perfil"
      className="rounded-circle"
      style={{ width: '150px', height: '150px'}}
    />
    <label htmlFor="inputFotoPerfil" className="position-absolute" style={{ top: '60%', left: '60%' }}>
      <FontAwesomeIcon
        icon={faCamera}
        className="text-light"
        style={{ fontSize: '1.5rem', cursor: 'pointer' }}
      />
    </label>
    <input
      type="file"
      id="inputFotoPerfil"
      style={{ display: 'none' }}
      onChange={(e) => setPerfil({ ...perfil, fotoPerfil: URL.createObjectURL(e.target.files[0]) })}
    />
  </div>
</div>






      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nombre"
            name="nombre"
            value={perfil.nombre}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formFechaNacimiento">
          <Form.Label>Fecha de Nacimiento</Form.Label>
          <Form.Control
            type="date"
            name="fechaNacimiento"
            value={perfil.fechaNacimiento}
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
            value={perfil.descripcion}
            onChange={handleInputChange}
          />
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = '/perfil'}>
            Cancelar
          </Button>
        </div>
      </Form>

    </div>
    } />
    </>
  );
}

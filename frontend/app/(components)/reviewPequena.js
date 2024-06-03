"use client";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import Estrellas from "./Estrellas";
import { useState } from "react";
import { Carousel } from "react-bootstrap";
import { Accordion } from "react-bootstrap";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import "@github/relative-time-element"

export default function ReviewPequena({id, r }) {
	const [tipoMediaSeleccionada, setTipoMediaSeleccionada] =
		useState("pelicula");

	const media = {
		pelicula: r.review.mediaRecuerda
			.filter((e) => e.tipo === "pelicula")
			.map((p) => {
				return (
					<Carousel.Item key={p.id}>
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
		libro: r.review.mediaRecuerda
			.filter((e) => e.tipo === "libro")
			.map((p) => {
				return (
					<Carousel.Item key={p.id}>
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
		videojuego: r.review.mediaRecuerda
			.filter((e) => e.tipo === "videojuego")
			.map((p) => {
				return (
					<Carousel.Item key={p.id}>
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
		musica: r.review.mediaRecuerda
			.filter((e) => e.tipo === "musica")
			.map((p) => {
				return (
					<Carousel.Item key={p.id}>
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
		<Card className="p-3">
			<Row>
				<Col xs={3} md={1}>
					<Image
						fluid
						src={r.usuario.imagen}
						roundedCircle
						className="border border-1"
					/>
				</Col>
				<Col>
					<div className="d-flex flex-column flex-md-row gap-1 gap-md-3 pt-auto mb-2">
						<Link
							className="text-decoration-none"
							href={"/perfil/" + r.usuario.id}
							passHref
						>
							<span className="text-primary fw-semibold">
								{r.usuario.nombre}
							</span>
						</Link>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={3} md={1}></Col>
				<Col xs={12} md={11}>
					<Stack gap={3}>
						<div>{r.review.descripcion}</div>
						<div className="d-flex flex-column flex-sm-row gap-2 gap-sm-4 mb-2">
							<Estrellas calificacion={r.review.calificacion} />
							<Stack
								className="justify-content-center justify-content-sm-start text-body-secondary"
								direction="horizontal"
								gap={3}
							>
								<Stack direction="horizontal" gap={1}>
									<i className="fa-regular fa-heart"></i>
									{r.review.likes.length}
								</Stack>
								<Stack direction="horizontal" gap={1}>
									<i className="fa-regular fa-comment"></i>
									{r.review.comentarios.length}
								</Stack>
							</Stack>
						</div>
						<Row>
							<Col xs={12} sm={8}>
								<p className="text-center text-sm-start text-body-tertiary">
									Publicado{" "}
									<relative-time lang="es" datetime={r.review.fecha}>
										{r.review.fecha}
									</relative-time>
								</p>
							</Col>
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
									href={"/perfil/" + r.usuario.id + "/resena/" + r.review._id}
									passHref
								>
									<div className="d-grid gap-2 pt-3 pt-sm-0 ms-auto">
										<Button variant="primary" size="sm">
											Ver review completa
										</Button>
									</div>
								</Link>
							</Col>
						</Row>
					</Stack>
				</Col>
			</Row>
			<Accordion flush>
				<Accordion.Item className="rounded-top-0" eventKey="0">
					<Accordion.Header>
						<span className="fw-bold">Le recuerda a:</span>
					</Accordion.Header>
					<Accordion.Body>
						{/* Botones en horizontal */}
						<ToggleButtonGroup
							type="radio"
							name={id + "options_horizontal" + r.id}
							onChange={(v) => {
								
								setTipoMediaSeleccionada(v);
							}}
							value={tipoMediaSeleccionada}
							className="d-none d-sm-flex"
						>
							<ToggleButton
								variant="outline-primary"
								id={id + "pelicula_" + r.id}
								value="pelicula"
							>
								Películas
							</ToggleButton>
							<ToggleButton
								variant="outline-primary"
								id={id + "libro_" + r.id}
								value="libro"
							>
								Libros
							</ToggleButton>
							<ToggleButton
								variant="outline-primary"
								id={id + "videojuego" + r.id}
								value="videojuego"
							>
								Videojuegos
							</ToggleButton>
							<ToggleButton
								variant="outline-primary"
								id={id + "musica" + r.id}
								value="musica"
							>
								Música
							</ToggleButton>
						</ToggleButtonGroup>
						{/* Botones en vertical  */}
						<ToggleButtonGroup
							vertical
							type="radio"
							name={id + "options_movil" + r.id}
							onChange={(v) => {
								
								setTipoMediaSeleccionada(v);
							}}
							value={tipoMediaSeleccionada}
							className="d-flex d-sm-none"
						>
							<ToggleButton
								checked={tipoMediaSeleccionada == "pelicula"}
								variant="outline-primary"
								id={id + "peliculas_movil" + r.id}
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
								id={id + "libros_movil" + r.id}
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
								id={id + "videojuegos_movil" + r.id}
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
								id={id + "musica_movil" + r.id}
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
		</Card>
	);
}

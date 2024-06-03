"use client";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import { Table, ToggleButton, ToggleButtonGroup, Nav } from "react-bootstrap";
import { useState } from "react";
import parse from "html-react-parser";
import ReviewGrande from "./reviewGrande";
import ReviewPequena from "./reviewPequena";
import Link from "next/link";
import { useEasyToast } from "easy-toast-react-bootstrap";
import { useSession } from "next-auth/react";
import { Toast } from "react-bootstrap";
import {CloseButton} from "react-bootstrap";

export default function MediaGrande({ m }) {
	const session = useSession();
	const [tabInfo, setTabInfo] = useState("detalles");
	const [resenas, setResenas] = useState("amigos");
	const [showToast, closeToast] = useEasyToast();

	const tipoAutor = {
		pelicula: "Dirigida por:",
		libro: "Escrito por:",
		musica: "Artistas:",
		videojuego: "Desarrollado por:",
		undefined: "Autor:",
	};

	const Estrellas = ({ calificacion }) => {
		if (calificacion == undefined) return;
		let numEstrellasCompleta = Math.trunc(calificacion);
		let mediaEstrella;
		if (numEstrellasCompleta == 0) {
			mediaEstrella =
				calificacion % 1 >= 0.25 && calificacion % 1 <= 0.75;
			if (calificacion % 1 > 0.75) numEstrellasCompleta++;
		} else {
			mediaEstrella =
				calificacion % numEstrellasCompleta >= 0.25 &&
				calificacion % numEstrellasCompleta <= 0.75;
			if (calificacion % numEstrellasCompleta > 0.75)
				numEstrellasCompleta++;
		}

		let numEstrellasVacio = 5 - numEstrellasCompleta;
		if (mediaEstrella) numEstrellasVacio = numEstrellasVacio - 1;
		return (
			<Stack
				className="justify-content-center fs-4 text-primary"
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

	return (
		<Card className="mb-3">
			<Row className="g-0">
				<Col className="col-12 col-sm-4">
					<div className="p-4 d-flex flex-column gap-3">
						<Image
							fluid
							// Para evitar tarjetas muy grandes en pantallas anchas
							//style={{ maxHeight: "400px", width: "100%" }}
							className="object-fit-cover"
							src={m.imagen}
							alt={"Portada de la media" + m.nombre}
						/>
						{session.status=="authenticated" &&
							<>
							<Link href={`/nuevaReview?tipoMedia=${m.tipo}&idMedia=${m.id}`}>
								<div className="d-grid gap-2">
									<Button variant="primary">Hacer review</Button>
								</div>
							</Link>
							<div className="d-grid gap-2">
								<Button
								onClick={() => {
									fetch(
										`${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${session.data.user.id}/masTarde`,
										{
											method: "POST",
											headers: {
												Authorization: `Bearer ${session.data.user.token}`,
												"Content-Type":
													"application/json",
											},
											body: JSON.stringify({
												masTarde: {
													media: {
														tipo: m.tipo,
														idMedia:
															m.id,
													},
												},
											}),
										}
									).then(async (response) => {
										if (response.ok) {
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
															Para +
															tarde
															añadido
															correctamente
														</Toast.Body>
														<CloseButton
															className="me-2 m-auto"
															variant="white"
															onClick={
																closeToast
															}
														/>
													</Stack>
												</Toast>
											);
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
															{await response.text()}
														</Toast.Body>
														<CloseButton
															className="me-2 m-auto"
															variant="white"
															onClick={
																closeToast
															}
														/>
													</Stack>
												</Toast>
											);
										}
									});
								}}
								variant="info">Para + tarde</Button>
							</div>
							</>
						}
						<div className="d-flex flex-column align-items-center">
							<h4 className="text-primary">{m.calificacion}</h4>
							<Estrellas calificacion={m.calificacion} />
						</div>
					</div>
				</Col>
				<Col className="col-sm-8 p-1 p-lg-4">
					<div className="p-3 h-100 d-flex flex-column gap-3">
						<div className="flex-fill">
							<Row>
								<Col
									xs={12}
									sm={m.tipo === "musica" ? 12 : "auto"}
								>
									<Stack direction={"horizontal"} gap={3}>
										<h4 className="fw-lg-semibold">
											{m.nombre} ({m.fecha_salida})
										</h4>
											<Badge bg="black" pill>
												{m.tipo
													.charAt(0)
													.toUpperCase() +
													m.tipo.slice(1)}
											</Badge>
									</Stack>
								</Col>
							</Row>
							<Card.Text className="pt-2 text-bold">
								{tipoAutor[m.tipo]}{" "}
								<i>
									{m.autor.map((g, i) => {
										if (i == m.autor.length - 1)
											return g + ".";
										else return g + ", ";
									})}
								</i>
							</Card.Text>
							<Card.Text className="pt-2 text-secondary">
								{m.tipo != "pelicula" &&
									parse(m.descripcion ? m.descripcion : "")}
							</Card.Text>
							{m.tipo == "musica" && m.canciones != undefined && (
								<div className="pt-2">
									<b>Canciones: </b>
									<Table responsive striped hover>
										<thead>
											<tr>
												<th>Nº</th>
												<th>Titulo</th>
												<th>Duracion</th>
											</tr>
										</thead>
										<tbody>
											{m.canciones.map((g, i) => (
												<tr key={g.index}>
													<td>{g.index}</td>
													<td>{g.nombre}</td>
													<td>
														{Math.round(
															g.duracion /
																1000 /
																60
														)}
														:
														{(
															g.duracion -
															Math.round(
																g.duracion /
																	1000 /
																	60
															)
														)
															.toString()
															.slice(0, 2)}
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								</div>
							)}
							{/* <Tabs
                                defaultActiveKey="reparto"
                                id="uncontrolled-tab-example"
                                className="mb-3"
                            >
                                <Tab eventKey="reparto" title="Reparto">
                                    Reparte pelicula
                                </Tab>
                                <Tab eventKey="detalles" title="Detalles">
                                    Detalles pelicula
                                </Tab>
                                <Tab eventKey="genero" title="Género">
                                    Género
                                </Tab>
                            </Tabs> */}
							{m.tipo == "pelicula" && (
								<Tab.Container
									activeKey={tabInfo}
									id="left-tabs-example"
								>
									<ToggleButtonGroup
										type="radio"
										name={"options_horizontal" + m.id}
										value={tabInfo}
										onChange={(v) => {
											setTabInfo(v);
										}}
										className="d-flex flex-column btn-group-row flex-md-row"
									>
										<ToggleButton
											id="horizontal-detalles"
											variant="outline-primary"
											value="detalles"
										>
											Sinopsis
										</ToggleButton>
										<ToggleButton
											id="horizontal-reparto"
											variant="outline-primary"
											value="reparto"
										>
											Reparto
										</ToggleButton>

										<ToggleButton
											id="horizontal-genero"
											variant="outline-primary"
											value="genero"
										>
											Género
										</ToggleButton>
									</ToggleButtonGroup>
									<Tab.Content className="pt-3">
										<Tab.Pane eventKey="reparto">
											<Table responsive striped hover>
												<thead>
													<tr>
														<th>Actor/Actriz</th>
														<th>Papel</th>
													</tr>
												</thead>
												<tbody>
													{m.reparto.map((p) => (
														<tr
															key={p.actor_actriz}
														>
															<td>
																{p.actor_actriz}
															</td>
															<td>{p.papel}</td>
														</tr>
													))}
												</tbody>
											</Table>
										</Tab.Pane>
										<Tab.Pane eventKey="detalles">
											{m.descripcion}
										</Tab.Pane>
										<Tab.Pane eventKey="genero">
											<ul>
												{m.generos.map((g) => (
													<li key={g}>{g}</li>
												))}
											</ul>
										</Tab.Pane>
									</Tab.Content>
								</Tab.Container>
							)}
						</div>
					</div>
				</Col>
			</Row>
			<Row className="g-0">
				<Col className="p-4">
					{
						<Tab.Container
							activeKey={resenas}
							id="left-tabs-example"
						>
							<ToggleButtonGroup
								type="radio"
								name={"resenas_horizontal" + m.id}
								value={resenas}
								onChange={(v) => {
									setResenas(v);
								}}
								className="d-flex flex-column btn-group-row flex-md-row"
							>
								<ToggleButton
									id="horizontal-amigos"
									variant="outline-primary"
									value="amigos"
								>
									Reseñado por amigos
								</ToggleButton>
								<ToggleButton
									id="horizontal-todos"
									variant="outline-primary"
									value="todos"
								>
									Reseñado por usuarios
								</ToggleButton>
							</ToggleButtonGroup>
							<Tab.Content className="pt-3">
								<Tab.Pane eventKey="amigos">
									<Stack gap={3}>
										{m.reviews_amigos?.map((r) => (
											<ReviewPequena id={"amigos: " + r.id} key={"amigos: " + r.id} r={r} />
										))}
									</Stack>
								</Tab.Pane>
								<Tab.Pane eventKey="todos">
									{m.reviews_usuarios?.map((r) => (
										<ReviewPequena id={"todos: " + r.id} key={"todos: " + r.id} r={r} />
									))}
								</Tab.Pane>
							</Tab.Content>
						</Tab.Container>
					}
				</Col>
			</Row>
		</Card>
	);
}

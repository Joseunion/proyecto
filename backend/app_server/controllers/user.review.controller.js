//incluimos el modelo de usuarios
const usuarioModelo = require("../models/usuario");
const logger = require("../../logger");
const {
	obtenerDatosReview,
	obtenerDatosComentario,
} = require("./review.controller");

// función para dar like a una review
async function darLikeReview(req, res) {
	logger.info("user.review.controller: dar like a una review");
	try {
		let reviewEncontrada = false;
		let likeEncontrado = false;
		let indexReview;
		const usuario = await usuarioModelo.findById(req.params.id); // Encuentra el usuario
		if (!usuario) {
			logger.error("user.review.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				for (j = 0; j < usuario.reviews[i].likes.length; j++) {
					if (
						usuario.reviews[i].likes[j]._id == req.token.idUsuario
					) {
						likeEncontrado = true;
						break;
					}
				}
				indexReview = i;
				break;
			}
		}

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.review.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}
		const usuarioConectado = await usuarioModelo.findById(
			req.token.idUsuario
		);

		// si la persona ya ha dado like, evitamos que lo vuelva a dar
		if (!likeEncontrado) {
			usuario.reviews[indexReview].likes.push(req.token.idUsuario);

			notificacion = {
				tipo: "like-review",
				userOtro: req.token.idUsuario,
			};

			usuario.notificaciones.push(notificacion);
		} else {
			logger.error(
				"user.review.controller:ya ha dado like a esta review"
			);
			return res.status(409).send("Ya has dado like a esta review");
		}

		// actualizo la base de datos
		usuario.save();

		return res.status(201).send("Petición completada");
	} catch (err) {
		logger.error(
			"user.review.controller:error del servidor al dar like a una review"
		);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para quitar like a una review
async function quitarLikeReview(req, res) {
	logger.info("user.review.controller:quitar like de una review");
	try {
		let reviewEncontrada = false;
		let likeEncontrado = false;
		let indexReview;
		const usuario = await usuarioModelo.findById(req.params.id); // Encuentra todos los usuarios
		if (!usuario) {
			logger.error("user.review.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				for (j = 0; j < usuario.reviews[i].likes.length; j++) {
					if (
						usuario.reviews[i].likes[j]._id == req.token.idUsuario
					) {
						likeEncontrado = true;
						break;
					}
				}
				indexReview = i;
				break;
			}
		}

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.review.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}

		// si la persona ya ha dado like, evitamos que lo vuelva a dar
		if (!likeEncontrado) {
			return res.status(400).send("No ha dado like a esta review");
		} else {
			const datosActualizados = usuario.reviews[indexReview].likes.splice(
				j,
				1
			);
		}

		// actualizo la base de datos
		usuario.save();

		return res.status(204).send();
	} catch (err) {
		logger.error(
			"user.review.controller:error del servidor al quitar like de una review"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor");
	}
}

// función para comentar a una review
async function comentarReview(req, res) {
	logger.info("user.review.controller:comentar review");
	try {
		let reviewEncontrada = false;
		let indexReview;
		const usuario = await usuarioModelo.findById(req.params.id); // Encuentra todos los usuarios
		if (!usuario) {
			logger.error("user.review.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				indexReview = i;
				break;
			}
		}

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.review.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}

		comentario = {
			comentario: req.body.comentario,
			usuario: req.token.idUsuario,
		};

		usuario.reviews[indexReview].comentarios.push(comentario);

		// creo la notificacion
		notificacion = {
			tipo: "comentario-review",
			userOtro: req.token.idUsuario,
		};

		usuario.notificaciones.push(notificacion);

		// actualizo la base de datos
		usuario.save();

		return res.status(201).send("Petición completada");
	} catch (err) {
		logger.error(
			"user.review.controller:error del servidor al comentar review"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para quitar un comentario de una review
async function eliminarComentarioReview(req, res) {
	logger.info("user.review.controller:quitar comentario de una review");
	try {
		let reviewEncontrada = false;
		let comentarioEncontrado = false;

		const usuario = await usuarioModelo.findById(req.params.id); // Encuentra todos los usuarios
		if (!usuario) {
			logger.error("user.review.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				for (j = 0; j < usuario.reviews[i].comentarios.length; j++) {
					if (
						usuario.reviews[i].comentarios[j]._id ==
						req.params.idComentario
					) {
						comentarioEncontrado = true;
						break;
					}
				}
				indexReview = i;
				break;
			}
		}

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.review.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}

		// enviamos un error en caso de no encontrar el comentario
		if (!comentarioEncontrado) {
			logger.error("user.review.controller:comentario no encontrado");
			return res.status(404).send("Comentario no encontrado");
		}

		usuario.reviews[indexReview].comentarios.splice(j, 1);
		// guardamos la información actualizada
		const actualizarDatos = await usuarioModelo.findByIdAndUpdate(
			usuario._id,
			usuario
		);

		return res.status(204).send();
	} catch (err) {
		logger.error(
			"user.review.controller:Error del servidor al eliminar un comentario"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para dar like a un comentario de una review
async function darLikeComentarioReview(req, res) {
	logger.info("user.review.controller:dar like a comentario de una review");
	try {
		let reviewEncontrada = false;
		let comentarioEncontrado = false;
		let likeEncontrado = false;
		let indexReview;
		const usuario = await usuarioModelo.findById(req.params.id); // Encuentra todos los usuarios
		const usuario2 = await usuarioModelo.findById(req.params.id).lean();
		if (!usuario) {
			logger.error("user.review.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				for (j = 0; j < usuario.reviews[i].comentarios.length; j++) {
					if (
						usuario.reviews[i].comentarios[j]._id ==
						req.params.idComentario
					) {
						comentarioEncontrado = true;
						for (
							k = 0;
							k < usuario.reviews[i].comentarios[j].likes.length;
							k++
						) {
							if (
								usuario.reviews[i].comentarios[j].likes[k]
									._id == req.token.idUsuario
							) {
								likeEncontrado = true;
								break;
							}
						}
						break;
					}
				}
				indexReview = i;
				break;
			}
		}

		

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.review.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}

		// enviamos un error en caso de no encontrar el comentario
		if (!comentarioEncontrado) {
			logger.error("user.review.controller:comentario no encontrado");
			return res.status(404).send("Comentario no encontrado");
		}

		// si la persona ya ha dado like, evitamos que lo vuelva a dar
		if (!likeEncontrado) {
			like = req.token.idUsuario;

			usuario.reviews[indexReview].comentarios[j].likes.push(like);

			notificacion = {
				tipo: "like-comentario",
				userOtro: req.token.idUsuario,
			};

			usuario.notificaciones.push(notificacion);
		} else {
			logger.error(
				"user.review.controller:ya has dado like a este comentario"
			);
			return res.status(400).send("Ya has dado like a este comentario");
		}

		// actualizo la base de datos
		usuario.save();

		return res
			.status(200)
			.send(
				await obtenerDatosComentario(
					usuario2.reviews[indexReview].comentarios[j]
				)
			);
	} catch (err) {
		logger.error(
			"user.review.controller:error del servidor al dar like al comentario de una review"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para eliminar like a un comentario de una review
async function eliminarLikeComentarioReview(req, res) {
	logger.info(
		"user.review.controller:eliminar like al comentario de una review"
	);
	try {
		let reviewEncontrada = false;
		let comentarioEncontrado = false;
		let likeEncontrado = false;
		let indexReview;
		const usuario = await usuarioModelo.findById(req.params.id); // Encuentra todos los usuarios

		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				for (j = 0; j < usuario.reviews[i].comentarios.length; j++) {
					if (
						usuario.reviews[i].comentarios[j]._id ==
						req.params.idComentario
					) {
						comentarioEncontrado = true;
						for (
							k = 0;
							k < usuario.reviews[i].comentarios[j].likes.length;
							k++
						) {
							if (
								usuario.reviews[i].comentarios[j].likes[k]
									._id == req.token.idUsuario
							) {
								likeEncontrado = true;
								break;
							}
						}
						break;
					}
				}
				indexReview = i;
				break;
			}
		}

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.review.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}

		// enviamos un error en caso de no encontrar el comentario
		if (!comentarioEncontrado) {
			logger.error("user.review.controller:comentario no encontrado");
			return res.status(404).send("Comentario no encontrado");
		}

		// si la persona ya ha dado like, evitamos que lo vuelva a dar
		if (!likeEncontrado) {
			logger.error(
				"user.review.controller:no has dado like a este comentario"
			);
			return res.status(400).send("No has dado like a este comentario");
		} else {
			const datosActualizados = usuario.reviews[indexReview].comentarios[
				j
			].likes.splice(k, 1);
		}

		// actualizo la base de datos
		usuario.save();

		return res.status(204).send();
	} catch (err) {
		logger.error(
			"user.review.controller:error del servidor al eliminar like de un comentario de una review"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

async function obtenerReviewPorId(req, res) {
	logger.info("user.review.controller:obtener review por ID");
	try {
		let reviewEncontrada = false;
		const usuario = await usuarioModelo.findById(req.params.id).lean(); // Encuentra todos los usuarios
		if (!usuario) {
			logger.error("user.review.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		} // Devolvemos error en caso de no encontrar al usuario

		if (usuario.baneado) {
			logger.error("user.review.controller:review no disponible");
			return res.status(403).send("Review no disponible");
		}
		// encuentro la review solicitada entre las reviews del usuario
		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				const review = await obtenerDatosReview(usuario.reviews[i]);
				res.json({
					...review,
					usuario: {
						id: usuario._id,
						nombre: usuario.username,
					},
				});
			}
		}

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.review.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}
	} catch (err) {
		logger.error(
			"user.review.controller:error del servidor al encontrar review por ID"
		);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para obtener los comentarios de una review
async function obtenerComentariosPorReview(req, res) {
	logger.info("user.review.controller:obtener comentarios por review");
	try {
		let reviewEncontrada = false;
		const usuario = await usuarioModelo.findById(req.params.id).lean(); // Encuentra todos los usuarios
		if (!usuario) return res.status(404).send("Usuario no encontrado"); // Devolvemos error en caso de no encontrar al usuario

		if (usuario.baneado)
			return res.status(403).send("Review no disponible");
		// encuentro la review solicitada entre las reviews del usuario
		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				const comentarios = usuario.reviews[i].comentarios;
				const prueba = await Promise.all(
					comentarios.map(async (c) => {
						return {
							...c,
							usuario: {
								id: c.usuario,
								username: (
									await usuarioModelo.findById(c.usuario)
								).username,
							},
							likes: await Promise.all(
								c.likes.map(async (l) => {
									return {
										id: l,
										usuario: (
											await usuarioModelo.findById(l)
										).username,
									};
								})
							),
						};
					})
				);
				res.json(prueba);
			}
		}

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada)
			return res.status(404).send("Review no encontrada");
	} catch (err) {
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
	/*
	try {
		let reviewEncontrada = false;
		let conjuntoComentariosReview = [];
		const usuario = await Usuario.findById(req.params.id); // Encuentra todos los usuarios
		if (!usuario) return res.status(404).send('Usuario no encontrado');
		if (usuario.baneado){logger.error("user.review.controller:usuario no encontrado"); return res.status(403).send('Usuario no disponible');}

		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				conjuntoComentariosReview.push(usuario.reviews[i].comentarios);
				break;
			}
		}

		Promise.all(
			conjuntoLikesReviews.map(async (e) => {
				return Usuario.findById(e).then((usuariosHanDadoLike) => {
					return {
						username: usuariosHanDadoLike.username,
						id: usuariosHanDadoLike._id,
					};
				});
			})
		).then((resultados) => {
			
			return res
				.status(200)
				.json({ count: resultados.length, likesReview: resultados });
		});

		// enviamos un error en caso de no encontrar la review
		if(!reviewEncontrada) {logger.error("user.review.controller:review no encontrada");return res.status(404).send('Review no encontrada');}

	} catch (err) {
		logger.error("user.review.controller:error del servidor al obtener comentarios de una review");
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
	*/
}

// función para obtener los comentarios por ID
async function obtenerComentariosPorId(req, res) {
	logger.info("user.review.controller:obtener comentarios por ID");
	try {
		let reviewEncontrada = false;
		let comentarioEncontrado = false;
		const usuario = await usuarioModelo.findById(req.params.id).lean(); // Encuentra todos los usuarios
		if (!usuario) {
			logger.error("user.review.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}
		if (usuario.baneado) {
			logger.error("user.review.controller:usuario baneado");
			return res.status(403).send("Usuario no disponible");
		}

		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				for (j = 0; j < usuario.reviews[i].comentarios.length; j++) {
					if (
						usuario.reviews[i].comentarios[j]._id ==
						req.params.idComentario
					) {
						comentarioEncontrado = true;
						res.json(
							await obtenerDatosComentario(
								usuario.reviews[i].comentarios[j]
							)
						);
						break;
					}
				}
			}
		}

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.review.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}

		// enviamos un error en caso de no encontrar el comentario
		if (!comentarioEncontrado) {
			logger.error("user.review.controller:comentario no encontrado");
			return res.status(404).send("Comentario no encontrado");
		}
	} catch (err) {
		logger.error(
			"user.review.controller:error del servidor al obtener comentarios por ID"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

async function obtenerNumeroUsuariosPorFecha(req, res) {
	logger.info("user.controller: obtener número de usuarios por fecha");
	try {
		const resultado = await usuarioModelo.aggregate([
			{
				$group: {
					_id: {
						$dateToString: {
							format: "%Y-%m-%d",
							date: "$fechaCreacion",
						},
					},
					count: { $sum: 1 },
				},
			},
			{
				$sort: { _id: 1 }, // Ordenar por fecha
			},
		]);
		res.json(resultado);
	} catch (err) {
		logger.error(
			"user.controller: Error del servidor al obtener el número de usuarios por fecha"
		);
		console.error(err.message);
		res.status(500).send(
			"Error del servidor al obtener el número de usuarios por fecha"
		);
	}
}

// función para obtener los likes de una review
async function obtenerLikesDeReview(req, res) {
	logger.info("user.review.controller:obtener likes de una review");
	try {
		const conjuntoLikesReviews = [];
		let reviewEncontrada = false;
		const usuario = await usuarioModelo.findById(req.params.id);

		if (!usuario) {
			logger.error("user.review.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}
		if (usuario.baneado) {
			logger.error("user.review.controller:usuario no disponible");
			return res.status(403).send("Usuario no disponible");
		}

		if (usuario.reviews.length > 0) {
			for (i = 0; i < usuario.reviews.length; i++) {
				if (usuario.reviews[i]._id == req.params.idReview) {
					reviewEncontrada = true;
					for (j = 0; j < usuario.reviews[i].likes.length; j++) {
						conjuntoLikesReviews.push(usuario.reviews[i].likes[j]);
					}
				}
			}
		}

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.review.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}

		Promise.all(
			conjuntoLikesReviews.map(async (e) => {
				return usuarioModelo.findById(e).then((usuariosHanDadoLike) => {
					return {
						id: usuariosHanDadoLike._id,
						usuario: usuariosHanDadoLike.username,
					};
				});
			})
		).then((resultados) => {
			
			return res.json({
				count: resultados.length,
				likesReview: resultados,
			});
		});
	} catch (err) {
		logger.error(
			"user.review.controller:error del servidor al obtener likes de una review"
		);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para obtener los likes de un comentario de una review
async function obtenerLikesEnComentarioDeReview(req, res) {
	logger.info(
		"user.review.controller:obtener likes en comentarios de una review"
	);
	try {
		const conjuntoLikesComentario = [];
		let reviewEncontrada = false;
		const usuario = await usuarioModelo.findById(req.params.id); // Encuentra el usuario
		if (!usuario) {
			logger.error("user.review.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}
		if (usuario.baneado) {
			logger.error("user.review.controller:usuario baneado");
			return res.status(403).send("Usuario no disponible");
		}

		if (usuario.reviews.length > 0) {
			for (i = 0; i < usuario.reviews.length; i++) {
				if (usuario.reviews[i]._id == req.params.idReview) {
					reviewEncontrada = true;
					for (
						j = 0;
						j < usuario.reviews[i].comentarios.length;
						j++
					) {
						if (
							usuario.reviews[i].comentarios[j]._id ==
							req.params.idComentario
						) {
							comentarioEncontrado = true;
							for (
								k = 0;
								k <
								usuario.reviews[i].comentarios[j].likes.length;
								k++
							) {
								conjuntoLikesComentario.push(
									usuario.reviews[i].comentarios[j].likes[k]
								);
							}
							break;
						}
					}
					break;
				}
			}
		}

		Promise.all(
			conjuntoLikesComentario.map(async (e) => {
				return usuarioModelo.findById(e).then((usuariosHanDadoLike) => {
					return {
						id: usuariosHanDadoLike._id,
						usuario: usuariosHanDadoLike.username,
					};
				});
			})
		).then((resultados) => {
			
			return res.status(200).json({
				count: resultados.length,
				likesComentarioReview: resultados,
			});
		});

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.review.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}

		// enviamos un error en caso de no encontrar la review
		if (!comentarioEncontrado) {
			logger.error("user.review.controller:comentario no encontrado");
			return res.status(404).send("Comentario no encontrado");
		}
	} catch (err) {
		logger.error(
			"user.review.controller:error del servidor al obtener likes en comentarios de una review"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor");
	}
}

module.exports = {
	darLikeReview,
	quitarLikeReview,
	comentarReview,
	eliminarComentarioReview,
	darLikeComentarioReview,
	eliminarLikeComentarioReview,
	obtenerReviewPorId,
	obtenerComentariosPorReview,
	obtenerComentariosPorId,
	obtenerLikesDeReview,
	obtenerLikesEnComentarioDeReview,
	obtenerNumeroUsuariosPorFecha,
};

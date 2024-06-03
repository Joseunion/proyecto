//incluimos el modelo de usuarios
const logger = require("../../logger");
const { json } = require("express");
const usuarioModelo = require("../models/usuario");
const { getSpotifyToken } = require("../utils/getSpotifyToken");
const { obtenerDatosMedia } = require("../utils/obtenerDatos");
//const ctrlMusica = require("../controllers/musica.controller");
//const ctrlPelicula = require("../controllers/peliculas.controller");

// función para obtener todas las reviews de remindsmeof
async function obtenerReviews(req, res) {
	logger.info("review.controller:Obtener reviews");
	try {
		const usuarios = await usuarioModelo.find().lean(); // Encuentra todos los usuarios

		const conjuntoReviews = await Promise.all(
			usuarios.map(async (u) => {
				return await Promise.all(
					u.reviews.map(async (r) => {
						const datosReview = await obtenerDatosReview(r);
						datosReview.usuario = {
							id: u._id,
							username: u.username,
							imagen: u.imagen // Asegúrate de que la imagen del usuario está incluida en el esquema
						};
						return datosReview;
					})
				);
			})
		);

		const respuesta = {
			count: conjuntoReviews.flat().length, // Cuenta el número de reviews encontradas
			reviews: conjuntoReviews.flat(), // Incluye el array de usuarios en la respuesta
		};
		res.json(respuesta); // Envía el objeto respuesta en formato JSON
	} catch (err) {
		logger.error(
			"review.controller:Error del servidor al obtener las reviews"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

async function obtenerNumeroReviewsPorFecha(req, res) {
	logger.info("review.controller: Obtener reviews y contar por fecha");
	try {
		const usuarios = await usuarioModelo.find().lean(); // Obtener todos los usuarios

		// Obtener todas las reviews de todos los usuarios
		const todasLasReviews = usuarios.flatMap((u) => u.reviews);

		// Obtener los datos de todas las reviews
		const conjuntoReviews = await Promise.all(
			todasLasReviews.map(async (reviewId) => {
				return await obtenerDatosReview(reviewId);
			})
		);

		// Contar las reviews por fecha de creación
		const reviewsPorFecha = conjuntoReviews.reduce((acc, review) => {
			if (review && review.fecha instanceof Date) {
				// Verificar si la review y su fecha están definidas como un objeto Date
				const fecha = review.fecha.toISOString().split("T")[0]; // Extraer la parte de la fecha (YYYY-MM-DD)
				acc[fecha] = (acc[fecha] || 0) + 1; // Incrementar el contador de reviews para esa fecha
			}
			return acc;
		}, {});

		// Transformar el objeto reviewsPorFecha en un array de objetos con la estructura deseada
		const resultado = Object.keys(reviewsPorFecha).map((fecha) => {
			return {
				_id: fecha === "undefined" ? null : fecha,
				count: reviewsPorFecha[fecha],
			};
		});

		res.json(resultado); // Enviar el objeto respuesta en formato JSON
	} catch (err) {
		logger.error(
			"review.controller: Error del servidor al obtener las reviews y contar por fecha"
		);
		console.error(err.message);
		res.status(500).send(
			"Error del servidor al obtener las reviews y contar por fecha"
		);
	}
}

async function obtenerReviewsPorMedia(tipoMedia, idMedia) {
	try {
		const usuarios = await usuarioModelo.find().lean(); // Encuentra todos los usuarios

		const reviews = await Promise.all(usuarios.map(async (u) => {
			// Filtrar y encontrar la review que coincida
			const reviewEncontrada = u.reviews.find(
				(e) =>
					e.media.idMedia == idMedia &&
					e.media.tipo == tipoMedia
			);

			if (reviewEncontrada) {
				// Resolver todas las promesas en mediaRecuerda
				const mediaRecuerdaPromises = reviewEncontrada["mediaRecuerda"]?.map(async (m) => {
					const pr = await obtenerDatosMedia(m);
					
					return {
						...m,
						...pr,
					};
				}) || [];

				const mediaRecuerda = await Promise.all(mediaRecuerdaPromises);

				return {
					usuario: {
						id: u._id,
						nombre: u.username,
						imagen: u.imagen,
					},
					review: {
						...reviewEncontrada,
						mediaRecuerda,
					},
				};
			}

			return null;
		}));

		// Filtrar los resultados nulos
		const filteredReviews = reviews.filter(r => r !== null && r.review.mediaRecuerda);

		const media =
			usuarios
				.map((u) => {
					return {
						review: u.reviews.find(
							(e) =>
								e.media.idMedia == idMedia &&
								e.media.tipo == tipoMedia
						),
					};
				})
				.filter((r) => r.review != undefined)
				.reduce(
					(suma, review) => suma + review.review.calificacion,
					0
				) / reviews.length;

		return { reviews: filteredReviews, media: media };
	} catch (err) {
		console.error(err.message);
		return "Error del servidor al obtener los usuarios";
	}
}

//función para obtener las reviews de un usuario
async function obtenerReviewsAmigosPorMedia(tipoMedia, idMedia, idUsuario) {
	try {
		const usuario = await usuarioModelo.findById(idUsuario); // Encuentra el usuario

		const seguidos = await Promise.all(
			usuario.seguidos.map(
				async (p) => await usuarioModelo.findById(p).lean()
			)
		);

		
		

		const reviews = await Promise.all(seguidos.map(async (u) => {
			// Filtrar y encontrar la review que coincida
			const reviewEncontrada = u.reviews.find(
				(e) =>
					e.media.idMedia == idMedia &&
					e.media.tipo == tipoMedia
			);

			if (reviewEncontrada) {
				// Resolver todas las promesas en mediaRecuerda
				const mediaRecuerdaPromises = reviewEncontrada["mediaRecuerda"]?.map(async (m) => {
					const pr = await obtenerDatosMedia(m);
					
					return {
						...m,
						...pr,
					};
				}) || [];

				const mediaRecuerda = await Promise.all(mediaRecuerdaPromises);

				return {
					usuario: {
						id: u._id,
						nombre: u.username,
						imagen: u.imagen,
					},
					review: {
						...reviewEncontrada,
						mediaRecuerda,
					},
				};
			}

			return null;
		}));

		// Filtrar los resultados nulos
		const filteredReviews = reviews.filter(r => r !== null && r.review.mediaRecuerda);

		return filteredReviews
	} catch (err) {
		console.error(err.message);
		return "Error del servidor al obtener los usuarios";
	}
}

async function obtenerNombreUsuario(id) {
	const usuario = await usuarioModelo.findById(id);

	return usuario.username;
}

async function obtenerFotoPerfilUsuario(id) {
	const usuario = await usuarioModelo.findById(id);

	return usuario.imagen;
}

async function obtenerDatosReview(review) {
	return {
		...review,
		media: {
			...review.media,
			...(await obtenerDatosMedia(review.media)),
		},
		mediaRecuerda: await Promise.all(
			review.mediaRecuerda.map(async (m) => {
				return {
					...m,
					...(await obtenerDatosMedia(m)),
				};
			})
		),
		likes: await Promise.all(
			review.likes.map(async (l) => {
				return {
					id: l._id,
					usuario: await obtenerNombreUsuario(l._id),
				};
			})
		),
		comentarios: await Promise.all(
			review.comentarios.map(async (c) => {
				return {
					...c,
					usuario: {
						id: c.usuario,
						username: await obtenerNombreUsuario(c.usuario),
						imagen: await obtenerFotoPerfilUsuario(c.usuario),
					},
					likes: await Promise.all(
						c.likes.map(async (l) => {
							
							return {
								id: l._id,
								usuario: await obtenerNombreUsuario(l._id),
							};
						})
					),
				};
			})
		),
	};
}

async function obtenerDatosComentario(comentario) {
	return {
		...comentario,
		usuario: {
			id: comentario.usuario,
			username: await obtenerNombreUsuario(comentario.usuario),
		},
		likes: await Promise.all(
			comentario.likes.map(async (l) => {
				
				return {
					id: l._id,
					usuario: await obtenerNombreUsuario(l._id),
				};
			})
		),
	};
}

module.exports = {
	obtenerReviews,
	obtenerReviewsPorMedia,
	obtenerReviewsAmigosPorMedia,
	obtenerDatosReview,
	obtenerDatosComentario,
	obtenerNombreUsuario,
	obtenerNumeroReviewsPorFecha,
};

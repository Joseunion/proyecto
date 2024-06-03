//incluimos el modelo de usuarios
const usuarioModelo = require("../models/usuario");
const logger = require("../../logger");
const { obtenerNombreUsuario } = require("./review.controller");

// función para obtener todas las reviews de remindsmeof
async function obtenerNotificacionesPorUsuario(req, res) {
	logger.info("Notificaciones.controller:Obtener notificaciones por usuario");
	try {
		const usuario = await usuarioModelo.findById(req.params.id).lean();
		if (!usuario) {
			logger.error("Notificaciones.controller:Usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		conjuntoNotificaciones = await Promise.all(
			usuario.notificaciones.map(async (n) => {
				return await obtenerDatosNotificaciones(n);
			})
		);

		const respuesta = {
			count: conjuntoNotificaciones.length, // Cuenta el número de reviews encontradas
			notificaciones: conjuntoNotificaciones, // Incluye el array de usuarios en la respuesta
		};
		res.json(respuesta); // Envía el objeto respuesta en formato JSON
	} catch (err) {
		logger.error(
			"Notificaciones.controller: Error del servidor al obtener los usuarios"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para obtener todas las reviews de remindsmeof
async function obtenerNotificacionesPorUsuarioPorTipo(req, res) {
	logger.info(
		"Notificaciones.controller: obtener notificaciones por usuario por tipo"
	);
	try {
		const conjuntoNotificacionesNuevoSeguidor = [];
		const conjuntoNotificacionesComentarioReview = [];
		const conjuntoNotificacionesLikeReview = [];
		const conjuntoNotificacionesLikeComentario = [];
		const usuario = await usuarioModelo.findById(req.params.id).lean();
		if (!usuario) {
			logger.error("Notificaciones.controller: Usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		for (i = 0; i < usuario.notificaciones.length; i++) {
			if (usuario.notificaciones[i].tipo == "nuevo-seguidor") {
				conjuntoNotificacionesNuevoSeguidor.push(
					usuario.notificaciones[i]
				);
			} else if (usuario.notificaciones[i].tipo == "comentario-review") {
				conjuntoNotificacionesComentarioReview.push(
					usuario.notificaciones[i]
				);
			} else if (usuario.notificaciones[i].tipo == "like-review") {
				conjuntoNotificacionesLikeReview.push(
					usuario.notificaciones[i]
				);
			} else {
				conjuntoNotificacionesLikeComentario.push(
					usuario.notificaciones[i]
				);
			}
		}

		nuevoSeguidor = await Promise.all(
			conjuntoNotificacionesNuevoSeguidor.map(async (n) => {
				return await obtenerDatosNotificaciones(n);
			})
		);

		comentarioReview = await Promise.all(
			conjuntoNotificacionesComentarioReview.map(async (n) => {
				return await obtenerDatosNotificaciones(n);
			})
		);

		likeReview = await Promise.all(
			conjuntoNotificacionesLikeReview.map(async (n) => {
				return await obtenerDatosNotificaciones(n);
			})
		);

		likeComentario = await Promise.all(
			conjuntoNotificacionesLikeComentario.map(async (n) => {
				return await obtenerDatosNotificaciones(n);
			})
		);

		const respuesta = {
			// Cuenta el número de reviews de peliculas encontradas
			notificacionesNuevoSeguidor: {
				count: nuevoSeguidor.length,
				notificaciones: nuevoSeguidor,
			},
			notificacionesComentarioReview: {
				count: comentarioReview.length,
				notificaciones: comentarioReview,
			},
			notificacionesLikeReview: {
				count: likeReview.length,
				notificaciones: likeReview,
			},
			notificacionesLikeComentario: {
				count: likeComentario.length,
				notificaciones: likeComentario,
			},
		};
		res.json(respuesta); // Envía el objeto respuesta en formato JSON
	} catch (err) {
		logger.error(
			"Notificaciones.controller: Error del servidor al obtener los usuarios"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

async function obtenerDatosNotificaciones(n) {
	return {
		...n,
		userOtro: {
			id: n.userOtro,
			username: await obtenerNombreUsuario(n.userOtro),
		},
	};
}

module.exports = {
	obtenerNotificacionesPorUsuario,
	obtenerNotificacionesPorUsuarioPorTipo,
};

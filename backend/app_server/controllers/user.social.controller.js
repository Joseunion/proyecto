//incluimos el modelo de usuarios
const usuarioModelo = require("../models/usuario");
const logger = require("../../logger");

// función para obtener los seguidores de un usuario
async function obtenerSeguidores(req, res) {
	logger.info("user.social.controller:obtener seguidores");
	try {
		const usuario = await usuarioModelo.findById(req.params.id);

		Promise.all(
			usuario.seguidores.map(async (e) => {
				
				return usuarioModelo.findById(e).then((usuarioSeguidor) => {
					

					return {
						username: usuarioSeguidor.username,
						id: usuarioSeguidor._id,
					};
				});
			})
		).then((resultados) => {
			
			return res
				.status(200)
				.json({ count: resultados.length, seguidores: resultados });
		});
	} catch (err) {
		logger.error("user.social.controller:error al obtener seguidores");
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para obtener los siguiendo de un usuario
async function obtenerSeguidos(req, res) {
	logger.info("user.social.controller:obtener seguidos");
	try {
		const usuario = await usuarioModelo.findById(req.params.id);

		Promise.all(
			usuario.seguidos.map(async (e) => {
				
				return usuarioModelo.findById(e).then((usuarioSeguido) => {
					

					return {
						username: usuarioSeguido.username,
						id: usuarioSeguido._id,
					};
				});
			})
		).then((resultados) => {
			
			return res
				.status(200)
				.json({ count: resultados.length, seguidos: resultados });
		});
	} catch (err) {
		logger.error("user.social.controller:error al obtener seguidos");
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para seguir a un usuario
async function seguirUsuario(req, res) {
	logger.info("user.social.controller:seguir usuario");
	try {
		var seSiguen = false;

		// guardamos la información de la persona que está siguiendo a un nuevo usuario
		const usuario = await usuarioModelo.findById(req.params.id);
		if (!usuario) {
			logger.error("user.social.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		// comprobamos si el usuario que quiere seguir está registrado en remindsmeof

		const usuarioASeguir = await usuarioModelo.findById(req.body.idUsuario);

		if (req.params.id == req.body.idUsuario) {
			logger.error(
				"user.social.controller:No puedes seguirte a ti mismo"
			);
			return res.status(409).send("No puedes seguirte a ti mismo");
		}

		// si el usuario existe añadimos el nuevo seguidor en su cuenta
		// y la persona que hace la petición tendrá un nuevo seguido
		if (usuarioASeguir) {
			// comprobamos si ya sigue a esa persona
			usuarioASeguir.seguidores.forEach((e) => {
				if (e.equals(usuario._id)) {
					seSiguen = true;
					logger.error(
						"user.social.controller:el usuario ya sigue a esta persona"
					);
					return res
						.status(409)
						.send("El usuario ya sigue a esa persona");
				}
			});

			// si no se siguen añadimos las cuentas al vector de seguidores y seguidos
			if (!seSiguen) {
				usuarioASeguir.seguidores.push(usuario._id);
				usuario.seguidos.push(usuarioASeguir._id);

				notificacion = {
					tipo: "nuevo-seguidor",
					userOtro: req.token.idUsuario,
				};

				usuarioASeguir.notificaciones.push(notificacion);

				const actualizarSeguidor =
					await usuarioModelo.findByIdAndUpdate(
						usuarioASeguir._id,
						usuarioASeguir
					);

				const actualizarSeguido = await usuarioModelo.findByIdAndUpdate(
					usuario._id,
					usuario
				);
			}
			return res.json(usuario);
		} else {
			logger.error("user.social.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}
	} catch (error) {
		logger.error(
			"user.social.controller:error del servidor al seguir a un usuario"
		);
		return res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para dejar de seguir a un usuario
async function dejarSeguirUsuario(req, res) {
	logger.info("user.social.controller:dejar de seguir usuario");
	try {
		// guardamos la información de la persona que está siguiendo a un nuevo usuario
		const usuario = await usuarioModelo.findById(req.params.id);
		if (!usuario) {
			logger.error("user.social.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		// comprobamos si el usuario que quiere seguir está registrado en remindsmeof
		const comprobarUsuario = await usuarioModelo.findById(
			req.body.idUsuario
		);

		// si el usuario existe añadimos el nuevo seguidor en su cuenta
		// y la persona que hace la petición tendrá un nuevo seguido
		if (comprobarUsuario) {
			// quitamos ambos usuarios de los vectores de seguidores y seguidos
			const index1 = comprobarUsuario.seguidores.indexOf(usuario._id);
			comprobarUsuario.seguidores.splice(index1, 1);

			const index2 = usuario.seguidos.indexOf(comprobarUsuario._id);
			usuario.seguidos.splice(index2, 1);

			

			const actualizarSeguidor = await usuarioModelo.findByIdAndUpdate(
				comprobarUsuario._id,
				comprobarUsuario
			);

			const actualizarSeguido = await usuarioModelo.findByIdAndUpdate(
				usuario._id,
				usuario
			);

			return res.status(204).send();
		} else {
			logger.error("user.social.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}
	} catch (error) {
		logger.error(
			"user.social.controller:error del servidor al dejar de seguir usuario"
		);
		return res
			.status(500)
			.send("Error del servidor al obtener los usuarios");
	}
}

async function buscarUsuario(req, res) {
	logger.info("user.social.controller: buscar usuarios");
	try {
		const usuarios = await usuarioModelo.find().lean();

		const usuariosCoincidentes = usuarios.filter((u) =>
			u.username.includes(req.query.nombreUsuario)
		);

		const prueba = usuariosCoincidentes.map((u) => {
			return {
				id: u._id,
				username: u.username,
				imagen: u.imagen,
				email: u.email,
				baneado: u.baneado
			};
		});

		return res.json(prueba);
	} catch (error) {
		logger.error(
			"user.social.controller:error del servidor al buscar usuarios"
		);
		return res
			.status(500)
			.send("Error del servidor al obtener los usuarios");
	}
}

module.exports = {
	obtenerSeguidores,
	obtenerSeguidos,
	seguirUsuario,
	dejarSeguirUsuario,
	buscarUsuario,
};

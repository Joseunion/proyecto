//incluimos el modelo de usuarios

const usuarioModelo = require("../models/usuario");
const logger = require("../../logger");

var jwt = require("jsonwebtoken");
const { getSpotifyToken } = require("../utils/getSpotifyToken");
const { obtenerTokenDeAcceso } = require("./videojuego.controller");
const {
	obtenerDatosReview,
	obtenerNombreUsuario,
} = require("./review.controller");
const { infoMedia } = require("../utils/obtenerDatos");
const { ObjectId } = require('mongodb');

// función para validar que el email introducido está en formato email
const validarEmail = (email) => {
	return email.match(
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);
};

// función para validar que la fecha introducida está en un formato válido
const validarFecha = (fecha) => {
	// First check for the pattern
	if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(fecha)) return false;

	// Parse the date parts to integers
	var partes = fecha.split("/");
	var dia = parseInt(partes[0], 10);
	var mes = parseInt(partes[1], 10);
	var agno = parseInt(partes[2], 10);

	// Check the ranges of month and year
	if (agno < 1000 || agno > 3000 || mes == 0 || mes > 12) return false;

	var mesLong = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	// Adjust for leap years
	if (agno % 400 == 0 || (agno % 100 != 0 && agno % 4 == 0)) mesLong[1] = 29;

	// Check the range of the day
	return dia > 0 && dia <= mesLong[mes - 1];
};

// función para obtener los usuarios registrados en el sistema
async function obtenerUsuarios(req, res) {
	logger.info("user.controller: obtener usuarios");
	try {
		const usuarios = await usuarioModelo.find().lean(); // Encuentra todos los usuarios

		/*
		const conjuntoUsuarios = await Promise.all(
			usuarios.map(async (u) => {
				return await obtenerDatosUsuario(u);
			})
		);
		*/

		const respuesta = {
			count: usuarios.length, // Cuenta el número de usuarios encontrados
			usuarios: usuarios, // Incluye el array de usuarios en la respuesta
		};
		
		res.json(respuesta); // Envía el objeto respuesta en formato JSON
	} catch (err) {
		logger.error(
			"user.controller:Error del servidor al obtener los usuarios"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para obtener la información de un usuario en concreto registrado en el sistema
async function obtenerUsuarioPorId(req, res) {
	logger.info("user.controller:obtener usuario por ID");
	try {
		const usuario = await usuarioModelo.findById(req.params.id).lean(); // Busca el usuario
		if (!usuario) return res.status(404).send("Usuario no encontrado"); // En caso de que el usuario no exista devuelve un error

		if (usuario.baneado)
			return res.status(403).send("Usuario no disponible");
		res.json(await obtenerDatosUsuario(usuario)); // Envía el usuario en formato JSON
	} catch (err) {
		logger.error("user.controller:Usuario no encontrado por ID");
		res.status(404).send("Usuario no encontrado");
	}
}
//CHECK
//obtener datos de un usuario para su perfil
async function obtenerDatosUsuarioPerfil(req, res) {
	//obtener username, email,descripcion,imagen,fecha nacimiento
	logger.info("user.controller:obtener datos del usuario para el perfil");
	try {
		const usuario = await usuarioModelo.findById(req.params.id); // Busca el usuario
		if (!usuario) return res.status(404).send("Usuario no encontrado"); // En caso de que el usuario no exista devuelve un error
		if (usuario.baneado)
			return res.status(403).send("Usuario no disponible");
		delete usuario.password; //elimino el campo password
		delete usuario.baneado;
		res.json(usuario); // Envía el usuario en formato JSON
	} catch (err) {
		logger.error("user.controller:Usuario no encontrado por ID");
		res.status(404).send("Usuario no encontrado");
	}
}
//CHECK
//obtener datos de un usuario para su perfil
async function saberAdmin(req, res) {
	logger.info("user.controller:saber si un usuario es admin");
	try {
		const usuario = await usuarioModelo.findById(req.params.id); // Busca el usuario
		if (!usuario) return res.status(404).send("Usuario no encontrado"); // En caso de que el usuario no exista devuelve un error
		res.json(usuario.admin); // Envía el usuario en formato JSON
	} catch (err) {
		logger.error("user.controller:Usuario no encontrado por ID");
		res.status(404).send("Usuario no encontrado");
	}
}
//CHECK
// función para baner un usuario del sistema TEST
async function banearUsuarioPorId(req, res) {
	logger.info("user.controller:banear usuario por ID");
	const idParaBanear = req.params.id;

	try {
		// Encuentra y actualiza el usuario, devolviendo el documento actualizado
		const usuarioBaneado = await usuarioModelo.findByIdAndUpdate(
			idParaBanear,
			{ $set: { baneado: true } },
			{ new: true, runValidators: true }
		);

		if (!usuarioBaneado) {
			logger.error("user.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		res.json(usuarioBaneado);
	} catch (err) {
		logger.error("user.controller:Error del servidor al banear usuario");
		console.error(err.message);
		res.status(500).send("Error del servidor al banear el usuario");
	}
}
// función para baner un usuario del sistema TEST
async function desbanearUsuarioPorId(req, res) {
	logger.info("user.controller:desbanear usuario por ID");
	const idParaBanear = req.params.id;

	try {
		// Encuentra y actualiza el usuario, devolviendo el documento actualizado
		const usuarioBaneado = await usuarioModelo.findByIdAndUpdate(
			idParaBanear,
			{ $set: { baneado: false } },
			{ new: true, runValidators: true }
		);

		if (!usuarioBaneado) {
			logger.error("user.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		res.json(usuarioBaneado);
	} catch (err) {
		logger.error("user.controller:Error del servidor al banear usuario");
		console.error(err.message);
		res.status(500).send("Error del servidor al banear el usuario");
	}
}
// función para actualizar los datos de un usuario existente en el sistema
async function actualizarUsuario(req, res) {
	logger.info("user.controller:actualizar usuario");
	const idParaActualizar = req.params.id;
	const { id, fecha_creacion, ...datosActualizados } = req.body;

	// Verifica si al menos una propiedad en datosActualizados está en el schema
	const schemaKeys = ["username", "email", "descripcion", "fechaNacimiento"]; // la fecha de nacimiento se puede cambiar (??)
	const tienePropiedadValida = Object.keys(datosActualizados).some((key) =>
		schemaKeys.includes(key)
	);

	// comprobamos que el email introducido es válido
	if (!validarEmail(datosActualizados.email)) {
		logger.error("user.controller:formato de email no valido");
		return res.status(400).send("Formato de email no válido.");
	}

	// comprobamos que la fecha introducida es válida
	if (!validarFecha(datosActualizados.fechaNacimiento)) {
		logger.error("user.controller:formato de fecha no valida");
		return res.status(400).send("Formato de fecha no válida.");
	} else {
		// pasar de formato europeo a formato estadounidense
		var euro_date = datosActualizados.fechaNacimiento;
		euro_date = euro_date.split("/");
		var us_date = euro_date.reverse().join("-");
		datosActualizados.fechaNacimiento = Date.parse(us_date);
	}

	if (!tienePropiedadValida) {
		logger.error(
			"user.controller:El cuerpo de la solicitud no contiene ninguna propiedad válida para actualizar."
		);
		return res
			.status(400)
			.send(
				"El cuerpo de la solicitud no contiene ninguna propiedad válida para actualizar."
			);
	}

	try {
		// Encuentra y actualiza el usuario, devolviendo el documento actualizado
		const usuarioActualizado = await usuarioModelo.findByIdAndUpdate(
			idParaActualizar,
			{ $set: datosActualizados },
			{ new: true, runValidators: true }
		);

		if (!usuarioActualizado) {
			logger.error("user.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		res.json(usuarioActualizado);
	} catch (err) {
		logger.error(
			"user.controller:Error del servidor al actualizar usuario"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al actualizar el usuario");
	}
}

// función para crear una cuenta en el sistema
async function crearCuenta(req, res) {
	logger.info("user.controller:crear cuenta");
	try {
		// comprobamos que el email introducido es válido
		if (!validarEmail(req.body.email)) {
			logger.error("user.controller:formato de email no valido");
			return res.status(400).send("Formato de email no válido.");
		}

		// comprobamos que la fecha introducida es válida
		if (!validarFecha(req.body.fechaNacimiento)) {
			logger.error("user.controller:formato de fecha no valida");
			return res.status(400).send("Formato de fecha no válida.");
		} else {
			// pasar de formato europeo a formato estadounidense
			var euro_date = req.body.fechaNacimiento;
			euro_date = euro_date.split("/");
			var us_date = euro_date.reverse().join("-");
			req.body.fechaNacimiento = Date.parse(us_date);
		}

		let usuario = new usuarioModelo(req.body);

		// comprobamos si ya existe un usuario registrado con ese username
		const comprobarUsername = await usuarioModelo.findOne({
			username: usuario.username,
		});
		if (comprobarUsername) {
			logger.error("user.controller:ya existe un usuario con ese nombre");
			return res.status(409).send("Ya existe un usuario con ese nombre");
		}

		// comprobamos si ya existe un usuario registrado con ese email
		const comprobarEmail = await usuarioModelo.findOne({
			email: usuario.email,
		});
		if (comprobarEmail) {
			logger.error("user.controller:ya existe un usuario con ese email");
			return res.status(409).send("Ya existe un usuario con ese email");
		}
		usuario.loginCon = "correo";
		usuario = await usuario.save();
		res.status(201).json(usuario);
	} catch (error) {
		
		logger.error("user.controller:Error al crear el usario");
		res.status(500).json({ error: "Error al crear el usuario" });
	}
}

// función para eliminar una cuenta
async function eliminarCuenta(req, res) {
	logger.info("user.controller:eliminar cuenta");
	const idParaEliminar = req.params.id;
	try {
		const usuario = await usuarioModelo.findById(idParaEliminar); // Encuentra todos los usuarios
		if (!usuario) {
			logger.error("user.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		for (i = 0; i < usuario.seguidores.length; i++) {
			
			const buscarSeguidor = await usuarioModelo.findById(
				usuario.seguidores[i]._id
			);
			for (j = 0; j < buscarSeguidor.seguidos.length; j++) {
				
				
				if (buscarSeguidor.seguidos[j].equals(usuario._id)) {
					
					buscarSeguidor.seguidos.splice(j, 1);
					
					const actualizar = await usuarioModelo.findByIdAndUpdate(
						buscarSeguidor._id,
						buscarSeguidor
					);
				}
			}
		}

		usuario.seguidores = [];

		usuario.baneado = true;

		// Intenta eliminar el estudiante por ID
		const resultado = await usuarioModelo.findByIdAndUpdate(
			idParaEliminar,
			usuario
		);

		// Si se elimina el usuario correctamente, devuelve una respuesta exitosa
		res.status(204).send(); // 204 No Content indica éxito pero no hay contenido para devolver
	} catch (err) {
		logger.error(
			"user.controller:error del servidor al eliminar el usuario"
		);
		console.error(err.message);
		// Maneja los errores de servidor y otros posibles errores
		res.status(500).send("Error del servidor al eliminar el usuario");
	}
}

// función para iniciar sesión en el sistema
async function iniciarSesionGoogle(req, res) {
	logger.info("user.controller:iniciar sesion google");
	try {
		// comprobamos si ya existe un usuario registrado con ese correo electrónico
		const comprobarUsuario = await usuarioModelo.findOne({
			email: req.body.email,
		});
		// Si el usuario existe
		if (comprobarUsuario) {
			// gestionamos si el usuario está baneado
			if (comprobarUsuario.baneado) {
				logger.error(
					"user.controller: el usuario esta baneado. No puede iniciar sesion"
				);
				res.status(403).send(
					"El usuario está baneado. No puede iniciar sesión"
				);
			}
			const jwtToken = await jwt.sign(
				{ idUsuario: comprobarUsuario._id },
				"clavesecreta"
			);
			return res.status(201).json({
				name: comprobarUsuario.username,
				email: comprobarUsuario.email,
				token: jwtToken,
			});
		} else {
			let usuario = new usuario({
				username: req.body.name,
				email: req.body.email,
				password: "",
			});

			usuario.loginCon = "google";
			usuario = await usuario.save();
			const jwtToken = await jwt.sign(
				{ idUsuario: usuario._id },
				"clavesecreta"
			);
			return res.status(201).json({
				name: usuario.username,
				email: usuario.email,
				token: jwtToken,
			});
		}
	} catch (err) {
		logger.error("user.controller:usuario no existente");
		res.status(404).send("Usuario no existente");
	}
}

// función para iniciar sesión en el sistema
async function iniciarSesionGithub(req, res) {
	logger.info("user.controller:iniciar sesion github");
	try {
		// comprobamos si ya existe un usuario registrado con ese correo electrónico
		const comprobarUsuario = await usuarioModelo.findOne({
			email: req.body.email,
		});
		// Si el usuario existe
		if (comprobarUsuario) {
			// gestionamos si el usuario está baneado
			if (comprobarUsuario.baneado) {
				logger.error(
					"user.controller: el usuario esta baneado. No puede iniciar sesion"
				);
				res.status(403).send(
					"El usuario está baneado. No puede iniciar sesión"
				);
			}
			const jwtToken = await jwt.sign(
				{ idUsuario: comprobarUsuario._id },
				"clavesecreta"
			);
			return res.status(201).json({
				name: comprobarUsuario.username,
				email: comprobarUsuario.email,
				token: jwtToken,
			});
		} else {
			let usuario = new usuario({
				username: req.body.name,
				email: req.body.email,
				password: "",
			});

			usuario.loginCon = "github";
			usuario = await usuario.save();
			const jwtToken = await jwt.sign(
				{ idUsuario: usuario._id },
				"clavesecreta"
			);
			return res.status(201).json({
				name: usuario.username,
				email: usuario.email,
				token: jwtToken,
			});
		}
	} catch (err) {
		logger.error("user.controller:usuario no existente");
		res.status(404).send("Usuario no existente");
	}
}

// función para iniciar sesión en el sistema
async function iniciarSesion(req, res) {
	logger.info("user.controller:iniciar sesion");
	try {
		// comprobamos que el email introducido es válido
		if (!validarEmail(req.body.email)) {
			logger.error("user.controller:formato de email no valido");
			return res.status(400).send("Formato de email no válido.");
		}

		// comprobamos si ya existe un usuario registrado con ese correo electrónico
		const comprobarUsuario = await usuarioModelo.findOne({
			email: req.body.email,
		});
		if (comprobarUsuario) {
			// gestionamos si el usuario está baneado

			if (comprobarUsuario.baneado) {
				logger.error(
					"user.controller: el usuario esta baneado. No puede iniciar sesion"
				);
				return res
					.status(403)
					.send("El usuario está baneado. No puede iniciar sesión");
			}

			// completamos la petición en caso de que la contraseña introducida coincida con la guardada
			if (comprobarUsuario.loginCon == "google") {
				logger.error(
					"user.controller:Iniciar sesion con correo cuando es con google"
				);
				return res
					.status(400)
					.send("Esta cuenta ha iniciado sesion con Google");
			} else if (comprobarUsuario.loginCon == "github") {
				logger.error(
					"user.controller:Iniciar sesion con correo cuando es con github"
				);
				return res
					.status(400)
					.send("Esta cuenta ha iniciado sesion con Github");
			} else if (comprobarUsuario.password !== req.body.password) {
				logger.error(
					"user.controller:El email o la contraseña no son correctas"
				);
				return res
					.status(400)
					.send("El email o la contraseña no son correctas");
			} else {
				const jwtToken = await jwt.sign(
					{ idUsuario: comprobarUsuario._id },
					"clavesecreta"
				);

				

				return res.status(201).json({
					nombre: comprobarUsuario.username,
					email: comprobarUsuario.email,
					token: jwtToken,
				});
			}
		} else {
			logger.error("user.controller:usuario no existente");
			return res.status(404).send("Usuario no existente");
		}
	} catch (err) {
		logger.error("user.controller:usuario no existente");
		return res.status(404).send("Usuario no existente");
	}
}

//función para obtener las reviews de un usuario
async function obtenerReviewsPorUsuario(req, res) {
	logger.info("user.controller:obtener reviews por usuario");
	try {
		const usuario = await usuarioModelo.findById(req.params.id).lean();
		if (!usuario) {
			logger.error("user.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		const conjuntoReviews = await Promise.all(
			usuario.reviews.map(async (r) => {
				return await obtenerDatosReview(r);
			})
		);

		const respuesta = {
			count: conjuntoReviews.length, // Cuenta el número de reviews encontradas
			reviews: conjuntoReviews, // Incluye el array de usuarios en la respuesta
		};
		res.json(respuesta); // Envía el objeto respuesta en formato JSON
	} catch (err) {
		logger.error(
			"user.controller:Error del servidor al obtener los usuarios"
		);
		console.error(err.message);
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}


async function obtenerReviewDeUsuario(req, res) {
    logger.info("user.controller:obtener review por usuario y id de review");
    try {
        const usuario = await usuarioModelo.findById(req.params.id).lean();
        if (!usuario) {
            logger.error("user.controller:usuario no encontrado");
            return res.status(404).send("Usuario no encontrado");
        }

        const reviewId = req.params.reviewId;
        if (!reviewId) {
            logger.error("user.controller:reviewId no proporcionado");
            return res.status(400).send("reviewId no proporcionado");
        }

        // Obtener todas las reviews del usuario
        const conjuntoReviews = await Promise.all(
            usuario.reviews.map(async (r) => {
                return await obtenerDatosReview(r);
            })
        );

        // Buscar la review específica
        const reviewEncontrada = conjuntoReviews.find(r => r._id.toString() === reviewId);

        if (!reviewEncontrada) {
            logger.error("user.controller:review no encontrada ");
            return res.status(404).send("Review no encontrada");
        }
		
        res.json(reviewEncontrada); // Envía la review encontrada en formato JSON
    } catch (err) {
        logger.error("user.controller:Error del servidor al obtener la review");
        console.error(err.message);
        res.status(500).send("Error del servidor al obtener la review");
    }
}




//función para obtener las reviews de un usuario por tipo
async function obtenerReviewsPorUsuarioPorTipo(req, res) {
	logger.info("user.controller:obtener reviews por usuario tipo");
	try {
		const conjuntoReviewsPelicula = [];
		const conjuntoReviewsMusica = [];
		const conjuntoReviewsLibro = [];
		const conjuntoReviewsVideojuego = [];
		const usuario = await usuarioModelo.findById(req.params.id).lean();
		if (!usuario) {
			logger.error("user.controller:Usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		// clasifica las reviews en base a su tipo
		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i].media.tipo == "pelicula") {
				conjuntoReviewsPelicula.push(usuario.reviews[i]);
			} else if (usuario.reviews[i].media.tipo == "musica") {
				conjuntoReviewsMusica.push(usuario.reviews[i]);
			} else if (usuario.reviews[i].media.tipo == "libro") {
				conjuntoReviewsLibro.push(usuario.reviews[i]);
			} else {
				conjuntoReviewsVideojuego.push(usuario.reviews[i]);
			}
		}

		

		peliculas = await Promise.all(
			conjuntoReviewsPelicula.map(async (r) => {
				return await obtenerDatosReview(r);
			})
		);

		musica = await Promise.all(
			conjuntoReviewsMusica.map(async (r) => {
				return await obtenerDatosReview(r);
			})
		);

		libros = await Promise.all(
			conjuntoReviewsLibro.map(async (r) => {
				return await obtenerDatosReview(r);
			})
		);

		videojuegos = await Promise.all(
			conjuntoReviewsVideojuego.map(async (r) => {
				return await obtenerDatosReview(r);
			})
		);

		const respuesta = {
			// Cuenta el número de reviews de peliculas encontradas
			reviewsPeliculas: {
				count: peliculas.length,
				reviews: peliculas,
			},
			// Cuenta el número de reviews de música encontradas
			reviewsMusica: {
				count: musica.length,
				reviews: musica,
			},
			// Cuenta el número de reviews de libros encontradas
			reviewsLibros: {
				count: libros.length,
				reviews: libros,
			},
			// Cuenta el número de reviews de videojiegos encontradas
			reviewsVideojuego: {
				count: videojuegos.length,
				reviews: videojuegos,
			},
		};
		res.json(respuesta); // Envía el objeto respuesta en formato JSON
	} catch (err) {
		logger.error("user.controller:Error del servidor al obtener reviews");
		res.status(500).send("Error del servidor al obtener los usuarios");
	}
}

// función para añadir una review
async function anadirReview(req, res) {
	logger.info("user.controller:añadir review");
	try {
		// creamos una review en el perfil del usuario indicado
		const usuario = await usuarioModelo.findById(req.params.id);
		if (!usuario) {
			logger.error("user.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		if (req.body.calificacion < 0 || req.body.calificacion > 5) {
			logger.error("user.controller:formato de calificacion no valido");
			res.status(400).send("Formato de calificación no válido");
		}

		infoExtra = await infoMedia(
			req.body.media.tipo,
			req.body.media.idMedia
		);

		// creo el objeto review
		review = {
			media: {
				tipo: req.body.media.tipo,
				idMedia: req.body.media.idMedia,
				nombre: infoExtra.nombre,
				imagen: infoExtra.imagen,
			},
			descripcion: req.body.descripcion,
			calificacion: req.body.calificacion,
			mediaRecuerda: req.body.mediaRecuerda,
		};

		
		// lo añado al vector de reviews del usuario
		usuario.reviews.push(await review);

		// actualizo la base de datos
		const actualizarDatos = await usuarioModelo.findByIdAndUpdate(
			req.params.id,
			usuario
		);

		return res.status(201).send(review);
	} catch (error) {
		logger.error("user.controller:Error del servidor al añadir una review");
		res.status(500).send("Error de servidor al obtener el usuario");
	}
}

// función para actualizar una review
async function actualizarReview(req, res) {
	logger.info("user.controller:actualizar review");

	try {
		let reviewEncontrada = false;

		// Encuentra y actualiza el usuario, devolviendo el documento actualizado
		const usuario = await usuarioModelo.findById(req.params.id);

		for (i = 0; i < usuario.reviews.length; i++) {
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				
				usuario.reviews[i].media = req.body.media;
				usuario.reviews[i].descripcion = req.body.descripcion;
				usuario.reviews[i].calificacion = req.body.calificacion;
				usuario.reviews[i].mediaRecuerda = req.body.mediaRecuerda;
				
			}
		}

		if (!usuario) {
			logger.error("user.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		if (!reviewEncontrada) {
			logger.error("user.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}

		usuario.save();

		return res.status(200).send();
	} catch (err) {
		console.error(err.message);
		logger.error("user.controller:Error del servidor al actualizar review");
		res.status(500).send("Error del servidor al actualizar el usuario");
	}
}

// función para eliminar una review
async function eliminarReview(req, res) {
	logger.info("user.controller:eliminar review");

	try {
		let reviewEncontrada = false;

		// buscamos el usuario en el sistema
		const usuario = await usuarioModelo.findById(req.params.id);
		if (!usuario) {
			logger.error("user.controller:usuario no encontrado");
			return res.status(404).send("Usuario no encontrado");
		}

		// buscamos la review del usuario en el sistema
		for (i = 0; i < usuario.reviews.length; i++) {
			
			
			if (usuario.reviews[i]._id == req.params.idReview) {
				reviewEncontrada = true;
				break;
			}
		}

		// enviamos un error en caso de no encontrar la review
		if (!reviewEncontrada) {
			logger.error("user.controller:review no encontrada");
			return res.status(404).send("Review no encontrada");
		}
		if (!reviewEncontrada)
			return res.status(404).send("Review no encontrada");

		// eliminamos la review del vector
		usuario.reviews.splice(i, 1);

		// guardamos la información actualizada
		const actualizarDatos = await usuarioModelo.findByIdAndUpdate(
			req.params.id,
			usuario
		);

		return res.status(204).send();
	} catch (error) {
		logger.error("user.controller:Error al eliminar una review");
		return res.status(500).send(error.message);
	}
}

// función para obtener la timeline que vería un usuario concreto
async function obtenerTimeline(req, res) {
	logger.info("user.controller:obtener timeLine");
	try {
		if (req.token) {
			const conjuntoSiguiendo = [];
			const usuario = await usuarioModelo.findById(req.token.idUsuario).lean();
			const usuariosTotal = await usuarioModelo.find().lean();

			// añado los ids de toda la gente a la que sigue
			usuario.seguidos.forEach((e) => {
				conjuntoSiguiendo.push(e);
			});

			// incluyo el id del propio usuario para que también aparezcan sus reviews
			conjuntoSiguiendo.push(usuario._id);

			const usuariosSiguiendo = await Promise.all(
				conjuntoSiguiendo.map(
					async (e) => await usuarioModelo.findById(e).lean()
				)
			);

			

			timeline = await Promise.all(
				usuariosSiguiendo.map(async (u) => {
					return await Promise.all(
						u.reviews.map(async (r) => {
							return {
								usuario: {
									id: u._id,
									nombre: u.username,
								},
								...(await obtenerDatosReview(r)),
							};
						})
					);
				})
			);
			if (timeline.flat(2).length == 0){
				timeline = await Promise.all(
					usuariosTotal.map(async (u) => {
						return await Promise.all(
							u.reviews.map(async (r) => {
								return {
									usuario: {
										id: u._id,
										nombre: u.username,
									},
									...(await obtenerDatosReview(r)),
								};
							})
						);
					})
				);
			}
		}
		else {
			const usuariosTotal = await usuarioModelo.find().lean();
			timeline = await Promise.all(
					usuariosTotal.filter((u) => !u.baneado)
					.map(async (u) => {
						return await Promise.all(
							u.reviews.map(async (r) => {
								return {
									usuario: {
										id: u._id,
										nombre: u.username,
									},
									...(await obtenerDatosReview(r)),
								};
							})
						);
					})
				);
		}
		

		

		const timelineFlatten = timeline.flat(2);

		const timelineOrdenada = timelineFlatten.sort(
			(e1, e2) => new Date(e2.fecha) - new Date(e1.fecha)
		);

		res.json(timelineOrdenada);
	} catch (err) {
		console.error(err);
		logger.error("user.controller:error del servidor al obtener time line");
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

async function obtenerDatosUsuario(usuario) {
	return {
		...usuario,
		reviews: await Promise.all(
			usuario.reviews.map(async (r) => {
				return {
					usuario: {
						id: usuario._id,
						nombre: usuario.nombre,
					},
					...(await obtenerDatosReview(r)),
				};
			})
		),
		seguidores: await Promise.all(
			usuario.seguidores.map(async (s) => {
				
				return {
					id: s,
					nombre: await obtenerNombreUsuario(s),
				};
			})
		),
		seguidos: await Promise.all(
			usuario.seguidos.map(async (s) => {
				
				return {
					id: s,
					nombre: await obtenerNombreUsuario(s),
				};
			})
		),
		notificaciones: await Promise.all(
			usuario.notificaciones.map(async (n) => {
				return {
					...n,
					userOtro: {
						id: n.userOtro,
						username: await obtenerNombreUsuario(n.userOtro),
					},
				};
			})
		),
	};
}

module.exports = {
	obtenerUsuarios,
	obtenerUsuarioPorId,
	actualizarUsuario,
	crearCuenta,
	eliminarCuenta,
	iniciarSesion,
	obtenerReviewsPorUsuario,
	anadirReview,
	actualizarReview,
	eliminarReview,
	obtenerTimeline,
	obtenerReviewsPorUsuarioPorTipo,
	saberAdmin,
	obtenerDatosUsuarioPerfil,
	banearUsuarioPorId,
	desbanearUsuarioPorId,
	iniciarSesionGoogle,
	iniciarSesionGithub,
	obtenerNumeroUsuariosPorFecha,
	obtenerReviewDeUsuario,
};

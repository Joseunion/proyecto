const ctrlReview = require("../controllers/review.controller");
const { obtenerTokenDeAcceso } = require("../utils/obtenerDatos");
// URL de la API de IGDB y tus credenciales
const igdb_url = "https://api.igdb.com/v4/games/";
const client_id = "l1im2wf7fn2yfgu1xu6xyvoc3t194i";
const client_secret = "5a3nxja8397w60z8qcc5jdcta14n7f";
let generosCache = [];

// Función para obtener todos los géneros y almacenarlos en la variable global
async function cargarGeneros() {
	const token = await obtenerTokenDeAcceso();
	const genreParams = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Client-ID": client_id,
			"Content-Type": "application/json",
		},
		body: "fields id,name; limit 500;", // Aumentar el límite si hay más de 500 géneros
	};

	try {
		const response = await fetch(
			"https://api.igdb.com/v4/genres",
			genreParams
		);
		const data = await response.json();
		generosCache = data; // Almacenar los géneros en la variable global
		
	} catch (error) {
		console.error("Error al obtener información de los géneros:", error);
	}
}

async function obtenerNombresGeneros(genreIds) {
	const generoNames = [];

	for (const genreId of genreIds) {
		const genero = generosCache.find((g) => g.id === genreId);
		if (genero) {
			generoNames.push(genero.name);
		} else {
			console.warn(`Género no encontrado para el ID: ${genreId}`);
		}
	}

	return generoNames;
}

async function obtenerAnioLanzamientoPorId(token, releaseId) {
	const releaseParams = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Client-ID": client_id,
			"Content-Type": "application/json",
		},
		body: `fields y; where id = ${releaseId};`, // Consulta para obtener el año
	};

	try {
		const response = await fetch(
			"https://api.igdb.com/v4/release_dates",
			releaseParams
		);
		const data = await response.json();
		if (data.length === 0) {
			throw new Error("No se encontró información para el ID dado");
		}
		return data[0].y; // Devolver el año
	} catch (error) {
		console.error("Error al obtener año de lanzamiento:", error);
		throw error;
	}
}
// Busca los juegos dado un id
async function obtenerJuego(req, res) {
	const id = req.params.id;
	const token = await obtenerTokenDeAcceso();
	const gameParams = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Client-ID": client_id,
			"Content-Type": "application/json",
		},
		body: `fields name,genres,name,involved_companies.company.name, release_dates.y, summary,cover.url; where id = ${id};`,
	};

	
	try {
		// Obtener información de los juegos
		const response = await fetch(igdb_url, gameParams);
		
		const data = await response.json();
		const game = data[0];
		const coverUrl = game.cover.url.replace("t_thumb", "t_cover_big");
		const generoIds = Array.isArray(game.genres)
			? game.genres
			: [game.genres];
		const generoNames = await obtenerNombresGeneros(generoIds);

		// Obtener el año de lanzamiento
		const releaseDate =
			game.release_dates &&
			game.release_dates[0] &&
			game.release_dates[0].y;

		// Obtener la empresa desarrolladora
		const developer =
			game.involved_companies &&
			game.involved_companies[0] &&
			game.involved_companies[0].company.name;

		const opiniones = await ctrlReview.obtenerReviewsPorMedia(
			"videojuego",
			req.params.id
		);

		if (req.token != undefined) {
			
			reviewsAmigos = await ctrlReview.obtenerReviewsAmigosPorMedia(
				"videojuego",
				req.params.id,
				req.token.idUsuario
			);
		}

		// Transformar la respuesta en formato JSON
		const juegoJSON = {
			id: game.id,
			imagen: coverUrl,
			generos: generoNames,
			nombre: game.name,
			descripcion: game.summary,
			tipo: "videojuego",
			fecha_salida: releaseDate,
			autor: [developer],
			nota: opiniones.media,
			reviews_usuarios: opiniones.reviews,
			reviews_amigos: req.token == undefined ? [] : reviewsAmigos,
		};
		// Devolver la información de los juegos en formato JSON
		res.json(juegoJSON);
	} catch (error) {
		console.error("Error al obtener información del juego:", error);
		throw error;
	}
}
async function obtenerJuegosPorNombre(req, res) {
	const nombre = req.query.titulo;
	const token = await obtenerTokenDeAcceso();
	const gameParams = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Client-ID": client_id,
			"Content-Type": "application/json",
		},
		body: `fields name,cover.url,genres, summary,involved_companies.company.name; search "${nombre}";`,
	};

	try {
		// Obtener información de los juegos
		const response = await fetch(igdb_url, gameParams);
		const data = await response.json();
		const juegosJSON = [];

		for (const juego of data) {
			
			// Modificar la URL de la cubierta
			const coverUrl = juego.cover?.url.replace("t_thumb", "t_cover_big");

			// Obtener la empresa desarrolladora
			const developer =
				juego.involved_companies &&
				juego.involved_companies[0] &&
				juego.involved_companies[0].company.name;

			// obtener los generos
			const generoIds = Array.isArray(juego.genres)
				? juego.genres
				: [juego.genres];
			const generoNames = await obtenerNombresGeneros(generoIds);

			// Agregar información del juego al arreglo de juegosJSON
			juegosJSON.push({
				id: juego.id,
				imagen: coverUrl,
				nombre: juego.name,
				descripcion: juego.summary,
				autor: [developer],
				generos: generoNames,
				tipo: "videojuego",
			});
		}
		// Devolver la información de los juegos en formato JSON
		res.json(juegosJSON);
	} catch (error) {
		console.error("Error al obtener información del juego:", error);
		throw error;
	}
}

async function obtenerJuegosPorRating(req, res) {
	const token = await obtenerTokenDeAcceso();

	const gameParams = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Client-ID": client_id,
			"Content-Type": "application/json",
		},
		body: "fields name,cover.url, genres, summary,release_dates.y,involved_companies.company.name,rating; sort rating desc;limit 20;",
	};

	try {
		// Obtener información de los juegos
		const response = await fetch(igdb_url, gameParams);
		const data = await response.json();
		const juegosJSON = [];
		for (const juego of data) {
			// Modificar la URL de la cubierta
			
			const coverUrl = juego.cover.url.replace("t_thumb", "t_cover_big");

			// Obtener el año de lanzamiento
			const releaseDate =
				juego.release_dates &&
				juego.release_dates[0] &&
				juego.release_dates[0].y;

			// obtener los generos
			const generoIds = Array.isArray(juego.genres)
				? juego.genres
				: [juego.genres];
			const generoNames = await obtenerNombresGeneros(generoIds);

			// Obtener la empresa desarrolladora
			const developer =
				juego.involved_companies &&
				juego.involved_companies[0] &&
				juego.involved_companies[0].company.name;

			// Agregar información del juego al arreglo de juegosJSON
			juegosJSON.push({
				id: juego.id,
				imagen: coverUrl, // URL modificada
				nombre: juego.name,
				descripcion: juego.summary,
				fecha_salida: releaseDate,
				autor: [developer],
				generos: generoNames,
				tipo: "videojuego",
			});
		}
		
		// Devolver la información de los juegos en formato JSON
		res.json(juegosJSON);
	} catch (error) {
		console.error("Error al obtener información del juego:", error);
		throw error;
	}
}

async function initialize() {
	await cargarGeneros();
}

initialize();

module.exports = {
	obtenerJuego,
	obtenerJuegosPorNombre,
	obtenerJuegosPorRating,
	obtenerTokenDeAcceso,
};

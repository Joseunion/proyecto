const logger = require("../../logger");
const ctrlReview = require("../controllers/review.controller");
const { isLogged } = require("../middlewares/isLogged.middleware");

async function obtenerAlbum(req, res) {
	logger.info("Musica.controller:Obtener album por ID");
	try {
		let reviewsAmigos = [];
		const response = await fetch(
			"https://api.spotify.com/v1/albums/" + req.params.id,
			{
				headers: {
					Authorization: "Bearer " + req.spotifyToken,
				},
			}
		);
		const getAlbum = await response.json();

		const canciones = getAlbum.tracks.items.map((c) => {
			return {
				index: c.track_number,
				nombre: c.name,
				duracion: c.duration_ms,
			};
		});

		const opiniones = await ctrlReview.obtenerReviewsPorMedia(
			"musica",
			req.params.id
		);

		if (req.token != undefined) {
			
			
			reviewsAmigos = await ctrlReview.obtenerReviewsAmigosPorMedia(
				"musica",
				req.params.id,
				req.token.idUsuario
			);
		}

		const fechaAlbum = new Date(getAlbum.release_date);

		const album = {
			id: getAlbum.id,
			imagen: getAlbum.images[0].url,
			nombre: getAlbum.name,
			tipo: "musica",
			fecha_salida: fechaAlbum.getFullYear(),
			id_artista: getAlbum.artists[0].id,
			autor: getAlbum.artists.map((a) => a.name),
			total_canciones: getAlbum.total_tracks,
			canciones: canciones,
			nota: opiniones.media,
			reviews_usuarios: opiniones.reviews,
			reviews_amigos: req.token == undefined ? [] : reviewsAmigos,
		};

		//console.dir(album, { depth: null });

		res.json(album);
	} catch (err) {
		logger.error("Musica.controller:Fallo al obtener album por ID");
	}
}

async function buscarAlbumPorTitulo(req, res) {
	logger.info("Musica.controller:Buscar album por titulo");
	try {
		const tipo = "album";

		// llamada a la API para obtener lista de albumes encontrados
		const response = await fetch(
			"https://api.spotify.com/v1/search?q=" +
				req.query.titulo +
				"&type=" +
				tipo,
			{
				headers: {
					Authorization: "Bearer " + req.spotifyToken,
				},
			}
		);
		const getAlbums = await response.json();
		

		// recorremos los albumes obtenidos
		const recorrerAlbumes = await Promise.all(
			getAlbums.albums.items.map(async (e) => {
				fechaAlbum = new Date(e.release_date);
				// datos del album
				const album = {
					id: e.id,
					imagen: e.images[0].url,
					nombre: e.name,
					fecha_salida: fechaAlbum.getFullYear(),
					id_artista: e.artists[0].id,
					autor: e.artists.map((a) => a.name),
					total_canciones: e.total_tracks,
					tipo: "musica",
				};
				
				return await album;
			})
		);
		res.json(recorrerAlbumes);
	} catch (err) {
		logger.error("Musica.controller:Fallo al obtener album por titulo");
		console.error(err.message);
	}
}

async function obtenerNovedadAlbumes(req, res) {
	logger.info("Musica.controller:Obtener novedades de albumes");
	try {
		// llamada a la API para obtener lista de albumes que son novedad
		const response = await fetch(
			"https://api.spotify.com/v1/browse/new-releases",
			{
				headers: {
					Authorization: "Bearer " + req.spotifyToken,
				},
			}
		);
		const getAlbums = await response.json();

		// recorremos los albumes obtenidos
		const recorrerAlbumes = await Promise.all(
			getAlbums.albums.items.map(async (e) => {
				// datos del album
				fechaAlbum = new Date(e.release_date);
				const album = {
					id: e.id,
					imagen: e.images[0].url,
					nombre: e.name,
					fecha_salida: fechaAlbum.getFullYear(),
					id_artista: e.artists[0].id,
					autor: e.artists.map((a) => a.name),
					total_canciones: e.total_tracks,
					tipo: "musica",
				};
				return await album;
			})
		);
		res.json(recorrerAlbumes);
	} catch (err) {
		logger.error("Musica.controller:Fallo al obtener novedades de albumes");
		console.error(err.message);
	}
}

module.exports = {
	obtenerAlbum,
	buscarAlbumPorTitulo,
	obtenerNovedadAlbumes,
};

const { getSpotifyToken } = require("./getSpotifyToken");

async function obtenerDatosMedia(media) {
	info = await infoMedia(media.tipo, media.idMedia);
	return {
		titulo: info.nombre,
		imagen: info.imagen,
	};
}

async function infoMedia(tipoMedia, idMedia) {
	if (tipoMedia == "musica") {
		response = await fetch("https://api.spotify.com/v1/albums/" + idMedia, {
			headers: {
				Authorization: "Bearer " + (await getSpotifyToken()),
			},
		});
		const getAlbum = await response.json();

		return {
			nombre: getAlbum.name,
			imagen: getAlbum.images[0].url,
		};
	} else if (tipoMedia == "pelicula") {
		response = await fetch(
			"https://api.themoviedb.org/3/movie/" + idMedia + "?language=es-ES",
			{
				headers: {
					Authorization: "Bearer " + process.env.TMDB_API_KEY,
				},
			}
		);
		const getPelicula = await response.json();
		return {
			nombre: getPelicula.title,
			imagen:
				"https://image.tmdb.org/t/p/w1280" + getPelicula.poster_path,
		};
	} else if (tipoMedia == "libro") {
		const url =
			"https://www.googleapis.com/books/v1/volumes/" +
			idMedia +
			"?key=" +
			process.env.API_KEY_BOOKS; // Usar el ID para obtener la información del libro

		const response = await fetch(url);
		const data = await response.json();
		return {
			nombre: data.volumeInfo.title,
			imagen: data.volumeInfo.imageLinks
				? data.volumeInfo.imageLinks.thumbnail
				: "No disponible",
		};
	} else {
		const igdb_url = "https://api.igdb.com/v4/games/";
		const token = await obtenerTokenDeAcceso();
		const gameParams = {
			method: "POST",
			headers: {
				Authorization: `Bearer ` + token,
				"Client-ID": process.env.CLIENT_ID_VIDEOGAMES,
				"Content-Type": "application/json",
			},
			body:
				`fields name,genres,name,involved_companies.company.name, release_dates.y, summary,cover.url; where id = ` +
				idMedia +
				`;`,
		};

		response = await fetch(igdb_url, gameParams);
		data = await response.json();
		const game = data[0];
		const coverUrl = game.cover.url.replace("t_thumb", "t_cover_big");
		return {
			nombre: game.name,
			imagen: "https:" + coverUrl,
		};
	}
}

// Función para obtener el token de acceso OAuth
async function obtenerTokenDeAcceso() {
	const tokenParams = new URLSearchParams();
	tokenParams.append("client_id", process.env.CLIENT_ID_VIDEOGAMES);
	tokenParams.append("client_secret", process.env.CLIENT_SECRET_VIDEOGAMES);
	tokenParams.append("grant_type", "client_credentials");

	try {
		const response = await fetch("https://id.twitch.tv/oauth2/token", {
			method: "POST",
			body: tokenParams,
		});
		const data = await response.json();
		return data.access_token;
	} catch (error) {
		console.error("Error al obtener el token de acceso:", error);
		throw error;
	}
}

module.exports = { obtenerDatosMedia, infoMedia, obtenerTokenDeAcceso };

const logger = require("../../logger");
const ctrlReview = require("../controllers/review.controller");
const claveAPI = "AIzaSyDGZRJp4IACr_4ikm1eRfu2CJcB423CqyU";

async function obtenerInformacionLibroPorId(req, res) {
	logger.info("libros.controller:Obtener informacion de un libro por ID");
	try {
		const id = req.params.id; // Asume que el ID del libro se pasa como parámetro en la solicitud
		//const id = "OgtHEAAAQBAJ";
		const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${claveAPI}`; // Usar el ID para obtener la información del libro

		const response = await fetch(url);
		const data = await response.json();

		if (!data || !data.volumeInfo) {
			logger.error(
				"libros.controller:No se encontró información para el libro con ID"
			);
			throw new Error(
				`No se encontró información para el libro con ID: "${id}"`
			);
		}

		const libro = data.volumeInfo;
		const tituloLibro = libro.title;
		const autores = libro.authors;
		const descripcion = libro.description;
		const portadaUrl = libro.imageLinks
			? libro.imageLinks.thumbnail
			: "No disponible";

		const opiniones = await ctrlReview.obtenerReviewsPorMedia(
			"libro",
			req.params.id
		);

		if (req.token != undefined) {
			
			reviewsAmigos = await ctrlReview.obtenerReviewsAmigosPorMedia(
				"libro",
				req.params.id,
				req.token.idUsuario
			);
		}

		const informacionLibro = {
			id: id,
			nombre: tituloLibro,
			autor: autores ? [autores] : ["No disponible"],
			descripcion: descripcion ? descripcion : "No disponible",
			imagen: portadaUrl,
			fecha_salida: libro.publishedDate
				? new Date(libro.publishedDate).getFullYear()
				: "No disponible",
			tipo: "libro",
			nota: opiniones.media,
			reviews_usuarios: opiniones.reviews,
			reviews_amigos: req.token == undefined ? [] : reviewsAmigos,
		};

		res.json(informacionLibro); // Envía la información del libro como respuesta JSON
	} catch (error) {
		logger.error(
			"libros.controller:Error al obtener información del libro:",
			error.message
		);
		res.status(500).json({
			error: "Error al obtener información del libro",
		});
	}
}

async function obtenerLibrosPopulares(req, res) {
	logger.info("libros.controller:Obtener libros populares");
	const url = "https://www.googleapis.com/books/v1/volumes";

	try {
		const respuesta = await fetch(
			`${url}?q=*&orderBy=relevance&maxResults=10&key=${claveAPI}`
		);

		if (!respuesta.ok) {
			logger.error("libros.controller:Al obtener libros populares");
			throw new Error(
				`Error al obtener libros populares: ${respuesta.status} - ${respuesta.statusText}`
			);
		}

		const datos = await respuesta.json();
		if (!datos.items || datos.items.length === 0) {
			logger.error(
				"libros.controller:No se encontraron libros populares"
			);
			throw new Error("No se encontraron libros populares");
		}

		const librosPopulares = datos.items.map((libro) => ({
			id: libro.id, // ID del libro
			nombre: libro.volumeInfo.title,
			imagen: libro.volumeInfo.imageLinks
				? libro.volumeInfo.imageLinks.thumbnail
				: "No disponible",
			descripcion: libro.volumeInfo.description || "No disponible",
			autor: libro.volumeInfo.authors
				? libro.volumeInfo.authors
				: ["No disponible"],
			fecha_salida: libro.volumeInfo.publishedDate
				? new Date(libro.volumeInfo.publishedDate).getFullYear()
				: "No disponible",
			tipo: "libro",
		}));

		res.json(librosPopulares); // Envía la lista de libros populares como respuesta JSON
	} catch (error) {
		logger.error("libros.controller:Error al obtener libros populares");
		console.error(error.message);
		res.status(500).json({ error: "Error al obtener libros populares" });
	}
}

async function buscarLibrosPorTitulo(req, res) {
	logger.info("libros.controller:Buscar un libro por titulo");
	try {
		//const titulo = 'nacidos de la bruma';
		const titulo = req.query.titulo;
		const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
			titulo
		)}&maxResults=10&key=${claveAPI}`;

		const response = await fetch(url);
		const data = await response.json();

		if (!data.items) {
			logger.error(
				"libros.controller:No se encontraron libros con ese titulo"
			);
			console.error("No se encontraron libros");
			return;
		}

		const libros = data.items.map((libro) => {
			const titulo = libro.volumeInfo.title;
			const id = libro.id;
			const portadaUrl = libro.volumeInfo.imageLinks
				? libro.volumeInfo.imageLinks.thumbnail
				: "No disponible";
			const descripcion = libro.volumeInfo.description || "No disponible";
			const autores = libro.volumeInfo.authors
				? libro.volumeInfo.authors
				: ["No disponible"];
			const año = libro.volumeInfo.publishedDate
				? new Date(libro.volumeInfo.publishedDate).getFullYear()
				: "No disponible";

			return {
				id: id,
				nombre: titulo,
				imagen: portadaUrl,
				descripcion: descripcion,
				autor: autores,
				fecha_salida: año,
				tipo: "libro",
			};
		});

		res.json(libros);
	} catch (error) {
		console.error("Error al buscar libros:", error.message);
		res.status(500).json({ error: "Error al buscar libros" });
	}
}

module.exports = {
	obtenerInformacionLibroPorId,
	buscarLibrosPorTitulo,
	obtenerLibrosPopulares,
};

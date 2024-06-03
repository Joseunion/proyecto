const ctrlReview = require("../controllers/review.controller");
const { isLogged } = require("../middlewares/isLogged.middleware");

async function obtenerPelicula(req, res) {
	try {
		
		// variable para reducir el reparto de películas
		var counter = 0;

		// variables para crear objetos JSON con datos de la película
		var generos = [];
		var reparto = [];
		var director = [];

		// id de ejemplo. no tengo claro de donde se sacará (??)
		idPelicula = req.params.id;

		// hacemos llamada a la API para obtener los datos de una película concreta
		const response = await fetch(
			"https://api.themoviedb.org/3/movie/" +
				idPelicula +
				"?language=es-ES",
			{
				headers: {
					Authorization: "Bearer " + process.env.TMDB_API_KEY,
				},
			}
		);
		const getDatos = await response.json();
		

		// vector para guardar el conjunto de generos de la película
		getDatos.genres.forEach((e) => {
			generos.push(e.name);
		});

		// hacemos otra llamada a la API para obtener el director y reparto
		const response2 = await fetch(
			"https://api.themoviedb.org/3/movie/" +
				idPelicula +
				"/credits?language=es-ES",
			{
				headers: {
					Authorization: "Bearer " + process.env.TMDB_API_KEY,
				},
			}
		);
		const getReparto = await response2.json();

		// recorremos todos los participantes de la película
		getReparto.cast.forEach((e) => {
			if (counter < 10) {
				reparto.push({ actor_actriz: e.name, papel: e.character });
				counter++;
			}
		});

		// buscamos el director o directores de la película
		getReparto.crew.forEach((e) => {
			if (e.known_for_department == "Directing" && e.job == "Director") {
				director.push(e.name);
			}
		});

		const opiniones = await ctrlReview.obtenerReviewsPorMedia(
			"pelicula",
			req.params.id
		);

		if (req.token != undefined) {
			
			
			reviewsAmigos = await ctrlReview.obtenerReviewsAmigosPorMedia(
				"pelicula",
				req.params.id,
				req.token.idUsuario
			);
		}

		const fechaPelicula = new Date(getDatos.release_date);

		// datos de la película
		pelicula = {
			id: idPelicula,
			nombre: getDatos.title,
			descripcion: getDatos.overview,
			imagen: "https://image.tmdb.org/t/p/w1280" + getDatos.poster_path,
			tipo: "pelicula",
			fecha_salida: fechaPelicula.getFullYear(),
			generos: generos,
			autor: director,
			reparto: reparto,
			nota: opiniones.media,
			reviews_usuarios: opiniones.reviews,
			reviews_amigos: req.token == undefined ? [] : reviewsAmigos,
		};
		res.json(pelicula);
	} catch (err) {
		console.error(err.message);
	}
}

async function buscarPeliculaPorTitulo(req, res) {
	const tituloPelicula = req.query.titulo;

	

	// llamada a la API para obtener lista de películas encontradas
	const response = await fetch(
		"https://api.themoviedb.org/3/search/movie?query=" +
			tituloPelicula +
			"&language=es-ES&page=1",
		{
			headers: {
				Authorization: "Bearer " + process.env.TMDB_API_KEY,
			},
		}
	);
	const getPeliculas = await response.json();

	// recorremos los resultados de películas obtenidos
	const peliculasPopulares = await Promise.all(
		getPeliculas.results.map(async (e) => {
			// variables para crear objetos JSON con datos de la película
			let generos = [];
			let reparto = [];
			let director = [];

			// por cada película obtenemos los datos necesarios

			// realizamos otra llamada a la API para obtener el director o el reparto
			const response2 = await fetch(
				"https://api.themoviedb.org/3/movie/" +
					e.id +
					"/credits?language=es-ES",
				{
					headers: {
						Authorization: "Bearer " + process.env.TMDB_API_KEY,
					},
				}
			);
			const getReparto = await response2.json();

			// recorremos todos los participantes de la película
			// variable para reducir el reparto de películas
			let repartoRestante = 10;
			for (let index = 0; index < getReparto.cast.length; index++) {
				const e = getReparto.cast[index];
				reparto.push({ actor_actriz: e.name, papel: e.character });
				repartoRestante--;
				if (repartoRestante == 0) break;
			}

			// buscamos el director o directores de la película
			director = getReparto.crew
				.filter((e) => e.job == "Director")
				.map((e) => e.name);

			// realizamos otra llamada a la api con el resto de datos que necesitamos
			const response3 = await fetch(
				"https://api.themoviedb.org/3/movie/" +
					e.id +
					"?language=es-ES",
				{
					headers: {
						Authorization: "Bearer " + process.env.TMDB_API_KEY,
					},
				}
			);
			const getOtrosDatos = await response3.json();
			

			// vector para guardar el conjunto de generos de la película
			getOtrosDatos.genres.forEach((e) => {
				generos.push(e.name);
			});

			const fechaPelicula = new Date(getOtrosDatos.release_date);

			// datos de la película
			pelicula = {
				id: getOtrosDatos.id,
				nombre: getOtrosDatos.title,
				imagen:
					"https://image.tmdb.org/t/p/w1280" +
					getOtrosDatos.poster_path,
				fecha_salida: fechaPelicula.getFullYear(),
				generos: generos,
				autor: director,
				reparto: reparto,
				tipo: "pelicula",
			};
			return await pelicula;
		})
	);
	res.json(peliculasPopulares);
}

async function obtenerPeliculasPopulares(req, res) {
	// llamada a la API para obtener lista de películas populares
	const response = await fetch(
		"https://api.themoviedb.org/3/movie/popular?language=es-ES&page=1",
		{
			headers: {
				Authorization: "Bearer " + process.env.TMDB_API_KEY,
			},
		}
	);
	const getPeliculas = await response.json();

	// recorremos los resultados de películas obtenidos
	const peliculasPopulares = await Promise.all(
		getPeliculas.results.map(async (e) => {
			// variables para crear objetos JSON con datos de la película
			let generos = [];
			let reparto = [];
			let director = [];

			// por cada película obtenemos los datos necesarios

			// realizamos otra llamada a la API para obtener el director o el reparto
			const response2 = await fetch(
				"https://api.themoviedb.org/3/movie/" +
					e.id +
					"/credits?language=es-ES",
				{
					headers: {
						Authorization: "Bearer " + process.env.TMDB_API_KEY,
					},
				}
			);
			const getReparto = await response2.json();

			// recorremos todos los participantes de la película
			// variable para reducir el reparto de películas
			let repartoRestante = 10;
			for (let index = 0; index < getReparto.cast.length; index++) {
				const e = getReparto.cast[index];
				reparto.push({ actor_actriz: e.name, papel: e.character });
				repartoRestante--;
				if (repartoRestante == 0) break;
			}

			// buscamos el director o directores de la película
			director = getReparto.crew
				.filter((e) => e.job == "Director")
				.map((e) => e.name);

			// realizamos otra llamada a la api con el resto de datos que necesitamos
			const response3 = await fetch(
				"https://api.themoviedb.org/3/movie/" +
					e.id +
					"?language=es-ES",
				{
					headers: {
						Authorization: "Bearer " + process.env.TMDB_API_KEY,
					},
				}
			);
			const getOtrosDatos = await response3.json();

			// vector para guardar el conjunto de generos de la película
			getOtrosDatos.genres.forEach((e) => {
				generos.push(e.name);
			});

			const fechaPelicula = new Date(getOtrosDatos.release_date);

			// datos de la película
			pelicula = {
				id: getOtrosDatos.id,
				nombre: getOtrosDatos.title,
				imagen:
					"https://image.tmdb.org/t/p/w1280" +
					getOtrosDatos.poster_path,
				fecha_salida: fechaPelicula.getFullYear(), // fecha formato americano cambiar si necesario
				generos: generos,
				autor: director,
				reparto: reparto,
				tipo: "pelicula",
			};
			return await pelicula;
		})
	);
	res.json(peliculasPopulares);
}

module.exports = {
	obtenerPeliculasPopulares,
	buscarPeliculaPorTitulo,
	obtenerPelicula,
};

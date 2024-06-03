var express = require("express");
var router = express.Router();

const ctrlLibro = require("../controllers/libros.controller");
const isLogged = require("../middlewares/isLogged.middleware")

/**
 * @swagger
 *   definitions:
 *     Libro:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *             description: ID del libro
 *             example: 2gk0EAAAQBAJ
 *           nombre:
 *             type: string
 *             description: Titulo del libro.
 *             example: Nacidos de la bruma
 *           imagen:
 *             type: string
 *             description: Portada del libro en formato url.
 *             example: "http://books.google.com/books/content?id=qxccEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
 *           descripcion:
 *             type: string
 *             description: Sinopsis del libro.
 *             example: Nueva edición de El Imperio Final. El primer volumen de «Nacidos de la Bruma (Mistborn)», con 8 ilustraciones a color. Brandon Sanderson es el gran renovador de la fantasía del siglo XXI, con veinte millones de lectores en todo el mundo. La saga Nacidos de la Bruma (Mistborn) es una obra imprescindible del Cosmere, el universo destinado a dar forma a la serie más extensa y fascinante jamás escrita en el ámbito de la fantasía épica. Durante mil años han caído cenizas del cielo.
 *           autor:
 *             type: array
 *             description: Conjunto de autores de un libro, va desde 1 autor a varios.
 *             items:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                   description: Contiene el nombre del autor
 *                   example: Brandon Sanderson
 *           fecha_salida:
 *             type: int
 *             description: Año de publicación del libro.
 *             example: 2018
 *           tipo:
 *             type: string
 *             description: tipo de la media
 *             example: libro
 *         required:
 *           - titulo
 *           - imagen
 *           - descripcion
 *           - autor
 *           - fecha_salida
 *           - libro
 */

// ------------------ LIBROS ---------------------

/**
 * @swagger
 * /api/libros:
 *   get:
 *     summary: Obtiene los libros populares.
 *     tags:
 *       - Libros
 *     description: Retorna una lista de los 10 libros más populares desde Google Books.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Devuelve una lista de películas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Libro'
 *       500:
 *         description: Error del servidor al obtener los libros
 *
 */

router.get("/", ctrlLibro.obtenerLibrosPopulares);

/**
 * @swagger
 * /api/libros/search:
 *   get:
 *     summary: Obtiene las libros que coincidan con el titulo buscado
 *     tags:
 *       - Libros
 *     description: Obtiene una lista de los 10 libros que coincidan con el titulo buscado.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: titulo
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: string
 *         description: titulo del libro
 *         example: Nacidos de la bruma
 *     responses:
 *       200:
 *         description: Devuelve un conjunto de libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Libro'
 *       500:
 *         description: Error del servidor al obtener el libro
 *
 */

router.get("/search", ctrlLibro.buscarLibrosPorTitulo);

/**
 * @swagger
 * /api/libros/{id}:
 *   get:
 *     summary: Devuelve la informacion de un libro.
 *     tags:
 *       - Libros
 *     description: Devuelve el titulo, la descripcion, los autores y la portada del libro con identificador 'id'.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del libro
 *     responses:
 *       200:
 *         description: Devuelve la informacion de un libro
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 libro:
 *                   type: object
 *                   $ref : '#definitions/Libro'
 *       500:
 *         description: Error del servidor al obtener el libro
 *
 */

router.get("/:id", isLogged.isLogged, ctrlLibro.obtenerInformacionLibroPorId);

module.exports = router;

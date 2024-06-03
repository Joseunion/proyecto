var express = require("express");
var router = express.Router();

const ctrlVideojuego = require("../controllers/videojuego.controller");
const isLogged = require("../middlewares/isLogged.middleware")

/**
 * @swagger
 *   definitions:
 *     Videojuego:
 *         type: object
 *         properties:
 *           id:
 *             type: int
 *             description: id asociado al videojuego.
 *             example: 173170
 *           imagen:
 *             type: string
 *             description: Portada del videojuego.
 *             example: "//images.igdb.com/igdb/image/upload/t_cover_big/co7dw9.jpg"
 *           nombre:
 *             type: string
 *             description: titulo del videojuego.
 *             example: "The Last of Us Part II: Remastered"
 *           descripcion:
 *             type: string
 *             description: Resumen de la sinopsis del videojuego
 *             example: "Experience the winner of over 300 Game of the Year awards now with an array of technical enhancements that make The Last of Us Part Il Remastered the definitive way to play Ellie and Abby's critically acclaimed story."
 *           fecha_salida:
 *             type: int
 *             description: Año de lanzamiento del videojuego.
 *             example: 2018
 *           autor:
 *             type: string
 *             description: Empresa desarrolladora del videojuego
 *             example: Naughty Dog
 *           generos:
 *             type: array
 *             description: Conjunto de generos de un videojuego.
 *             items:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                   description: Contiene el genero del videojuego
 *                   example: Aventura
 *           tipo:
 *             type: string
 *             description: tipo de la media
 *             example: videojuego
 *         required:
 *           - id
 *           - cover
 *           - name
 *           - summary
 *           - release_date
 *           - developer
 *           - generos
 */

/**
 * @swagger
 * /api/videojuegos:
 *   get:
 *     summary: Obtiene los videojuegos populares.
 *     tags:
 *       - Videojuegos
 *     description: Retorna una lista de los 20 videojuegos mas populares.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un vector de videojuegos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Videojuego'
 *       500:
 *         description: Error del servidor al obtener los videojuegos
 *
 */
router.get("/", ctrlVideojuego.obtenerJuegosPorRating);

/**
 * @swagger
 * /api/videojuegos/search:
 *   get:
 *     summary: Obtiene los videojuegos que coincidan con el titulo buscado
 *     tags:
 *       - Videojuegos
 *     description: Obtiene una lista de los videojuegos que coincidan con el titulo buscado.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: titulo
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: string
 *         description: titulo del videojuego
 *         example: Final Fantasy VII
 *     responses:
 *       200:
 *         description: Devuelve un conjunto de videojuegos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Videojuego'
 *       500:
 *         description: Error del servidor al obtener el videojuego
 *
 */

router.get("/search", ctrlVideojuego.obtenerJuegosPorNombre);

/**
 * @swagger
 * /api/videojuegos/{id}:
 *   get:
 *     summary: Devuelve la informacion de un videojuego.
 *     tags:
 *       - Videojuegos
 *     description: Devuelve el id, la cover, los generos, el nombre y el resumen del videojuego con identificador 'id'.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del videojuego
 *     responses:
 *       200:
 *         description: Devuelve la informacion de un videojuego
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref : '#definitions/Videojuego'
 *       500:
 *         description: Error del servidor al obtener el videojuego
 *
 */

router.get("/:id", isLogged.isLogged, ctrlVideojuego.obtenerJuego);

module.exports = router;

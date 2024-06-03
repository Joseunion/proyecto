var express = require("express");
var router = express.Router();

const ctrlPeliculas = require("../controllers/peliculas.controller");
const isLogged = require("../middlewares/isLogged.middleware")

/**
 * @swagger
 * /api/peliculas:
 *   get:
 *     summary: Obtiene las películas más populares
 *     tags:
 *       - Pelicula
 *     description: Obtiene una lista con las películas más populares
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
 *                 $ref : '#definitions/Pelicula'
 *       401:
 *         description: La autenticación falló
 *       422:
 *         description: Parámetros no válidos
 *       500:
 *         description: Fallo interno.
 *
 */

router.get("/", ctrlPeliculas.obtenerPeliculasPopulares);

/**
 * @swagger
 * /api/peliculas/search:
 *   get:
 *     summary: Obtiene las películas que coinciden con el título introducido
 *     tags:
 *       - Pelicula
 *     description: Obtiene una lista de películas que coinciden con el título introducido
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: titulo
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: string
 *         description: título de la película a buscar
 *         example: Vengadores
 *     responses:
 *       200:
 *         description: Devuelve una lista de películas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Pelicula'
 *       401:
 *         description: La autenticación falló
 *       422:
 *         description: Parámetros no válidos
 *       500:
 *         description: Fallo interno.
 *
 */

router.get("/search", ctrlPeliculas.buscarPeliculaPorTitulo);

/**
 * @swagger
 * /api/peliculas/{id}:
 *   get:
 *     summary: Obtiene una película del sistema
 *     tags:
 *       - Pelicula
 *     description: Obtiene una película del sistema que coincide con el id introducido
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la película que desea buscar
 *     responses:
 *       200:
 *         description: Devuelve una película
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref : '#definitions/Pelicula'
 *       401:
 *         description: La autenticación falló
 *       422:
 *         description: Parámetros no válidos
 *       500:
 *         description: Fallo interno.
 *
 */

router.get("/:id", isLogged.isLogged, ctrlPeliculas.obtenerPelicula);

module.exports = router;

var express = require("express");
var router = express.Router();

const ctrlMusica = require("../controllers/musica.controller");
const { getToken } = require("../middlewares/spotifyToken.middleware");
const { isLogged } = require("../middlewares/isLogged.middleware");

/**
 * @swagger
 * /api/musica:
 *   get:
 *     summary: Obtiene los álbumes nuevos
 *     tags:
 *       - Musica
 *     description: Obtiene una lista con las novedades en álbumes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Devuelve una lista de álbumes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Musica'
 *       401:
 *         description: Token expirado o erróneo
 *       403:
 *         description: Fallo autorización OAuth
 *       429:
 *         description: La aplicación ha excedido sus límites
 *
 */

router.get("/", getToken, ctrlMusica.obtenerNovedadAlbumes);

/**
 * @swagger
 * /api/musica/search:
 *   get:
 *     summary: Obtiene los álbumes que coinciden con el título introducido
 *     tags:
 *       - Musica
 *     description: Obtiene una lista de álbumes que coinciden con el título introducido
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: titulo
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: string
 *         description: título del álbum a buscar
 *         example: Future Nostalgia
 *     responses:
 *       200:
 *         description: Devuelve una lista de álbumes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Musica'
 *       401:
 *         description: Token expirado o erróneo
 *       403:
 *         description: Fallo autorización OAuth
 *       429:
 *         description: La aplicación ha excedido sus límites
 *
 */

router.get("/search", getToken, ctrlMusica.buscarAlbumPorTitulo);

/**
 * @swagger
 * /api/musica/album/{id}:
 *   get:
 *     summary: Obtiene un álbum del sistema
 *     tags:
 *       - Musica
 *     description: Obtiene un álbum del sistema que coincide con el id introducido
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del álbum que desea buscar
 *     responses:
 *       200:
 *         description: Devuelve un álbum
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref : '#definitions/Musica'
 *       401:
 *         description: Token expirado o erróneo
 *       403:
 *         description: Fallo autorización OAuth
 *       429:
 *         description: La aplicación ha excedido sus límites
 *
 */

router.get("/album/:id", getToken, isLogged, ctrlMusica.obtenerAlbum);

module.exports = router;

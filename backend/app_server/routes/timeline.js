var express = require("express");
var router = express.Router();

const ctrlUsuario = require("../controllers/user.controller");
const ctrlUsuarioReview = require("../controllers/user.review.controller");
const ctrlUsuarioMasTarde = require("../controllers/user.mastarde.controller");
const ctrlUsuarioSocial = require("../controllers/user.social.controller");
const ctrlNotificaciones = require("../controllers/notificaciones.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { getToken } = require("../middlewares/spotifyToken.middleware");
const isLogged = require("../middlewares/isLogged.middleware")


// --------------- TIMELINE -----------------

/**
 * @swagger
 * /api/timeline:
 *   get:
 *     summary: Obtiene las reviews de las personas que el usuario sigue
 *     tags:
 *       - Timeline
 *     description: Obtiene las reviews de las personas que el usuario con identificado 'id' sigue en orden más reciente
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Devuelve un conjunto de reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Review'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: La multimedia está ya añadida
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.get(
	"/",
	isLogged.isLogged,
	ctrlUsuario.obtenerTimeline
);

module.exports = router;
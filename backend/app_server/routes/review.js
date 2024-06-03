var express = require("express");
var router = express.Router();

const ctrlReview = require("../controllers/review.controller");
const verifyToken = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Obtiene todas las reviews del sistema
 *     tags:
 *       - Review
 *     description: Obtiene todas las reviews del sistema
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Devuelve una lista de reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   description: número de reviews que existen en el sistema
 *                   example: 1
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref : '#definitions/Review'
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.get("/", ctrlReview.obtenerReviews);
router.get("/numReviewsFecha", ctrlReview.obtenerNumeroReviewsPorFecha);


/*
router.get("/:idMedia", ctrlReview.obtenerReviewsPorMedia);
*/

module.exports = router;

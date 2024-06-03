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

/**
 * @swagger
 *   definitions:
 *     Usuario:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *             description: ID del usuario
 *             example: 66360a27725483113f5dafd8
 *           username:
 *             type: string
 *             description: Nickname del usuario.
 *             example: adrianarribas24
 *           email:
 *             type: string
 *             description: Correo electrónico del usuario.
 *             example: adrian24@gmail.es
 *           password:
 *             type: string
 *             description: Contraseña de la cuenta.
 *             example: password123
 *           descripcion:
 *             type: string
 *             description: Descripción del perfil del usuario.
 *             example: Hola, soy nuevo en RemindsMeOf
 *           imagen:
 *             type: string
 *             description: Foto de perfil del usuario.
 *             example: https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=1734
 *           fechaNacimiento:
 *             type: date
 *             description: Fecha de nacimiento del usuario.
 *             example: 2001-02-24T00:00:00.000Z
 *           baneado:
 *             type: boolean
 *             description: indica si el usuario está baneado o no
 *             example: false
 *           admin:
 *             type: boolean
 *             description: indica si el usuario tiene permisos de administrador o no
 *             example: false
 *           reviews:
 *             type: array
 *             description: Conjunto de reviews subidas por el usuario.
 *             items:
 *               $ref : '#definitions/Review'
 *           seguidores:
 *             type: array
 *             description: Contiene la información de los usuarios que siguen a esta cuenta
 *             items:
 *               $ref : '#definitions/Seguidores'
 *           seguidos:
 *             type: array
 *             description: Contiene el ID de los usuarios que esta cuenta sigue
 *             items:
 *               $ref : '#definitions/Seguidos'
 *           masTarde:
 *             type: array
 *             description: Conjunto de multimedia que el usuario desea ver más tarde
 *             items:
 *               $ref: '#/definitions/MediaRecordar'
 *           notificaciones:
 *             type: array
 *             description: Conjunto de notificaciones recibidas por el usuario
 *             items:
 *               $ref : '#definitions/Notificacion'
 *         required:
 *           - username
 *           - email
 *           - password
 *           - descripcion
 *           - imagen
 *           - fechaNacimiento
 *           - reviews
 *           - seguidores
 *           - seguidos
 *           - masTarde
 *           - notificaciones
 *         additionalProperties: false
 *     Review:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *             description: ID de la review
 *             example: 6649d9912afce8b80a7a8497
 *           media:
 *             $ref: '#/definitions/Media'
 *           descripcion:
 *             type: string
 *             description: Opinión que el usuario tiene acerca de la media a valorar.
 *             example: Me encanta, realmente la recomiendo
 *           calificacion:
 *             type: integer
 *             description: Valoración del 0 al 5 que el usuario le da a la media consumida.
 *             minimum: 0
 *             maximum: 5
 *             example: 4
 *           fecha:
 *             type: date
 *             description: Fecha en la que se valoró la media.
 *             example: 2024-05-19T10:50:57.113Z
 *           likes:
 *             type: array
 *             description: Contiene el ID de los usuarios que han dado like a la review
 *             items:
 *               $ref : '#definitions/Like'
 *           mediaRecuerda:
 *             type: array
 *             description: Contiene las medias que le recuerdan a la media a valorar.
 *             items:
 *               $ref: '#definitions/Media'
 *           comentarios:
 *             type: array
 *             description: Conjunto de comentarios que hacen sobre la review.
 *             items:
 *               $ref: '#/definitions/Comentario'
 *         required:
 *           - media
 *           - descripcion
 *           - calificacion
 *           - fecha
 *           - likes
 *           - mediaRecuerda
 *           - comentarios
 *         additionalProperties: false
 *     Comentario:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *             description: ID del comentario
 *             example: 664cd6f8aa4f8f4a67df6348
 *           comentario:
 *             type: string
 *             description: Opinion que el usuario tiene acerca de la review
 *             example: no coincido contigo
 *           usuario:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID de la persona que escribió el comentario
 *                 example: 66360a27725483113f5dafd8
 *               username:
 *                 type: string
 *                 description: Nickname de la persona que escribió el comentario
 *                 example: adrianarribas24
 *               imagen:
 *                 type: string
 *                 description: Foto de perfil del usuario
 *                 example: https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=1734
 *           likes:
 *             type: array
 *             description: Contiene el ID de los usuarios que han dado like a la review
 *             items:
 *               $ref : '#definitions/Like'
 *           fecha:
 *             type: string
 *             description: Fecha en la que se hizo el comentario
 *             example: 2024-05-21T17:16:40.153Z
 *         required:
 *           - comentario
 *           - usuario
 *           - likes
 *           - fecha
 *     Media:
 *         type: object
 *         properties:
 *           tipo:
 *             type: string
 *             description: Tipo de multimedia
 *             enum: [pelicula, videojuego, libro, musica]
 *             example: pelicula
 *           idMedia:
 *             type: string
 *             description: ID de la multimedia
 *             example: 666277
 *         required:
 *             - tipo
 *             - idMedia
 *     MediaRecordar:
 *          type: object
 *          properties:
 *            media:
 *              type: object
 *              $ref : '#definitions/Media'
 *            fecha:
 *              type: date
 *              example: 2024-05-21T17:16:40.153Z
 *
 *     Notificacion:
 *          type: object
 *          properties:
 *            tipo:
 *              type: string
 *              description: Tipo de notificacion recibida
 *              enum: [like-review, like-comentario, nuevo-seguidor, comentario-review]
 *              example: like-review
 *            userOtro:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: ID del usuario que ha generado la notificación
 *                  example: 663678be2cb03a926479a173
 *                username:
 *                  type: string
 *                  description: Nickname del usuario que ha generado la notificación
 *                  example: adrianarribas241
 *     Musica:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              description: id del álbum
 *              example: 5I4I0k75uiUnqyJvh7vxLC
 *            imagen:
 *              type: string
 *              description: imagen de la portada del álbum
 *              example: https://i.scdn.co/image/ab67616d00001e0231fc809752d7ad4732cd8bfd
 *            nombre:
 *               type: string
 *               description: título del álbum
 *               example: Cuando Menos Lo Espera
 *            fecha_salida:
 *               type: string
 *               description: fecha de publicación del álbum
 *               example: 2023-07-07
 *            id_artista:
 *                type: string
 *                description: id del artista principal
 *                example: 1Mw40k757jZuiL0NIJpdO5
 *            autor:
 *                type: array
 *                items:
 *                  type: string
 *                  description: nombre de los artistas
 *                  example: ["GULEED", "Morad"]
 *            total_canciones:
 *                type: number
 *                description: número de canciones que tiene el álbum
 *                example: 1
 *          required:
 *             - id
 *             - imagen
 *             - nombre
 *             - fecha_salida
 *             - id_artista
 *             - autor
 *             - total_canciones
 *     Pelicula:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              description: ID de la película
 *              example: 299536
 *            titulo:
 *              type: string
 *              description: Nombre de la película
 *              example: Vengadores, Infinity War
 *            imagen:
 *              type: string
 *              description: Imagen de portada de la película
 *              example: https://image.tmdb.org/t/p/w1280/ksBQ4oHQDdJwND8H90ay8CbMihU.jpg
 *            fecha_salida:
 *              type: date
 *              description: Fecha en la que la película se estrenó
 *              example: 2018-04-25
 *            generos:
 *              type: array
 *              description: Contiene los géneros pertenecientes a la película
 *              items:
 *                type: object
 *                properties:
 *                  genero:
 *                    type: string
 *                    description: Contiene un género perteneciente a la película
 *                    example: Aventura
 *                required:
 *                   - genero
 *            director:
 *              type: array
 *              description: Contiene las personas que han dirigido la película
 *              items:
 *                type: object
 *                properties:
 *                  director:
 *                    type: string
 *                    description: Contiene un director que ha dirigido la película
 *                    example: Pepe díaz
 *                required:
 *                   - director
 *            reparto:
 *              type: array
 *              description: Contiene el reparto que ha participado en la película
 *              items:
 *                type: object
 *                properties:
 *                  actor_actriz:
 *                    type: string
 *                    description: Contiene el nomnre del actor o actriz que ha participado en la película
 *                    example: Pepe díaz
 *                  papel:
 *                    type: string
 *                    description: Contiene el papel que ha interpretado el actor o actriz en la película
 *                    example: Diaz pepe
 *                required:
 *                   - actor_actriz
 *                   - papel
 *          required:
 *             - id
 *             - titulo
 *             - imagen
 *             - fecha_salida
 *             - generos
 *             - director
 *             - reparto
 *
 *     Seguidores:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *              description: nombre de usuario
 *              example: adrianarribas241
 *            id:
 *              type: string
 *              description: id del usuario
 *              example: 663678be2cb03a926479a173
 *     Seguidos:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *              description: nombre de usuario
 *              example: adrianarribas241
 *            id:
 *              type: string
 *              description: id del usuario
 *              example: 663678be2cb03a926479a173
 *
 *     Like:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *              description: ID del usuario que ha dado like
 *              example: 66360a27725483113f5dafd8
 *            usuario:
 *              type: string
 *              description: Nombre de usuario de la cuenta que ha dado like
 *              example: adrianarribas24
 *
 *
 */

// ------------------ GENERAL ----------------------

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Crea una nueva cuenta de usuario en el sistema.
 *     tags:
 *       - General
 *     description: Crea una nueva cuenta de usuario en el sistema.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: true
 *                 description: username del usuario.
 *                 example: swagger
 *               email:
 *                 required: true
 *                 type: string
 *                 description: correo electrónico del usuario.
 *                 example: swagger@gmail.es
 *               password:
 *                 required: true
 *                 type: string
 *                 description: contraseña de la cuenta.
 *                 example: password123
 *               fechaNacimiento:
 *                 required: true
 *                 type: string
 *                 description: fecha de nacimiento del usuario.
 *                 example: 24/02/2001
 *     responses:
 *       201:
 *         description: Devuelve el usuario creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref : '#definitions/Usuario'
 *       409:
 *         description: Ya existe un usuario con esos datos
 *       500:
 *         description: Error al crear el usuario
 *
 */
router.post("/signup", ctrlUsuario.crearCuenta);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Inicia sesión en el sistema.
 *     tags:
 *       - General
 *     description: Inicia sesión con las credenciales de un usuario existente en el sistema.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 required: true
 *                 type: string
 *                 description: correo electrónico del usuario.
 *                 example: swagger@gmail.es
 *               password:
 *                 required: true
 *                 type: string
 *                 description: contraseña de la cuenta.
 *                 example: password123
 *     responses:
 *       201:
 *         description: Devuelve el nombre de usuario, el correo electrónico y el token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                   description: nombre de usuario de la cuenta que ha iniciado sesión
 *                   example: adrianarribas24
 *                 email:
 *                   type: string
 *                   description: correo electrónico de la cuenta que ha iniciado sesión
 *                   example: adrian24@gmail.es
 *                 token:
 *                   type: string
 *                   description: token JWT de inicio de sesión
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVzdWFyaW8iOiI2NjM2MGEyNzcyNTQ4MzExM2Y1ZGFmZDgiLCJpYXQiOjE3MTYzMDU0ODB9.hH7hs8AwOIdbbv3rSXUWDJlzF8L5Bu0l0gNEIU0zZHc
 *       400:
 *         description: El email o la contraseña no son correctos
 *       403:
 *         description: Usuario baneado.
 *       404:
 *         description: Usuario no existente en el sistema
 *       500:
 *         description: Error del servidor al iniciar sesión
 *
 */
router.post("/login", ctrlUsuario.iniciarSesion);

/**
 * @swagger
 * /api/users/loginGoogle:
 *   post:
 *     summary: Inicia sesión en el sistema con Google
 *     tags:
 *       - General
 *     description: Inicia sesión con las credenciales de un usuario existente en el sistema.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 required: true
 *                 type: string
 *                 description: correo electrónico del usuario.
 *                 example: adrian24@gmail.es
 *               password:
 *                 required: true
 *                 type: string
 *                 description: contraseña de la cuenta.
 *                 example: password123
 *     responses:
 *       201:
 *         description: Devuelve un token de tipo JWT
 *       400:
 *         description: El email o la contraseña no son correctos
 *       403:
 *         description: Usuario baneado.
 *       404:
 *         description: Usuario no existente en el sistema
 *       500:
 *         description: Error del servidor al iniciar sesión
 *
 */
router.post("/loginGoogle", ctrlUsuario.iniciarSesionGoogle);

/**
 * @swagger
 * /api/users/loginGithub:
 *   post:
 *     summary: Inicia sesión en el sistema con Google.
 *     tags:
 *       - General
 *     description: Inicia sesión con las credenciales de un usuario existente en el sistema.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 required: true
 *                 type: string
 *                 description: correo electrónico del usuario.
 *                 example: adrian24@gmail.es
 *               password:
 *                 required: true
 *                 type: string
 *                 description: contraseña de la cuenta.
 *                 example: password123
 *     responses:
 *       201:
 *         description: Devuelve un token de tipo JWT
 *       400:
 *         description: El email o la contraseña no son correctos
 *       403:
 *         description: Usuario baneado.
 *       404:
 *         description: Usuario no existente en el sistema
 *       500:
 *         description: Error del servidor al iniciar sesión
 *
 */
router.post("/loginGithub", ctrlUsuario.iniciarSesionGithub);

/**
 * @swagger
 * /api/users/{id}/admin:
 *   get:
 *     summary: Permite saber si una cuenta es administradora.
 *     tags:
 *       - General
 *     description: Devuelve un booleano que indica si el usuario con identificador 'id' es administrador.
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
 *         description: Devuelve si el usuario es administrador
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *       500:
 *         description: Error del servidor al obtener los usuarios
 *
 */
router.get("/:id/admin", ctrlUsuario.saberAdmin);
router.get("/numUsersFecha", ctrlUsuario.obtenerNumeroUsuariosPorFecha);

// ------------------ USUARIO ---------------------

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene los usuarios registrados en el sistema.
 *     tags:
 *       - Usuario
 *     description: Obtiene la lista completa de los usuarios registrados en el sistema.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un vector de Usuarios y su longitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: número de usuarios totales
 *                   example: 1
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     $ref : '#definitions/Usuario'
 *       500:
 *         description: Error del servidor al obtener los usuarios
 *
 */

router.get("/", ctrlUsuario.obtenerUsuarios);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario del sistema.
 *     tags:
 *       - Usuario
 *     description: Obtiene la información del usuario cuyo identificador es 'id'.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Un objeto de tipo Usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   $ref : '#definitions/Usuario'
 *       403:
 *         description: El usuario no está disponible
 *       404:
 *         description: El usuario introducido no existe
 *       500:
 *         description: Error del servidor para obtener el usuario
 *
 */

router.get("/:id", ctrlUsuario.obtenerUsuarioPorId);
router.post("/banear/:id", ctrlUsuario.banearUsuarioPorId);
router.post("/desbanear/:id", ctrlUsuario.desbanearUsuarioPorId);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario del sistema.
 *     tags:
 *       - Usuario
 *     description: Actualiza el usuario cuyo identificador es 'id'.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: false
 *                 description: username del usuario.
 *                 example: adrian24
 *               email:
 *                 required: false
 *                 type: string
 *                 description: correo electrónico del usuario.
 *                 example: adrian@gmail.es
 *               password:
 *                 required: false
 *                 type: string
 *                 description: contraseña de la cuenta.
 *                 example: password
 *               fechaNacimiento:
 *                 required: false
 *                 type: string
 *                 description: fecha de nacimiento del usuario.
 *                 example: 28/02/2001
 *     responses:
 *       200:
 *         description: El usuario modificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   $ref : '#definitions/Usuario'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: El usuario introducido no existe
 *       500:
 *         description: Error del servidor al actualizar un usuario
 *
 */

router.put(
	"/:id",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	ctrlUsuario.actualizarUsuario
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario del sistema.
 *     tags:
 *       - Usuario
 *     description: Elimina el usuario cuyo identificador es 'id'.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Éxito sin contenido a devolver
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al eliminar un usuario
 *
 */

// IDEMPOTENTE???
router.delete(
	"/:id",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	ctrlUsuario.eliminarCuenta
);

// ------------- SEGUIDORES Y SIGUIENDO -------------

/**
 * @swagger
 * /api/users/{id}/seguidores:
 *   get:
 *     summary: Devuelve los seguidores de la cuenta.
 *     tags:
 *       - Social
 *     description: Devuelve una lista con los seguidores de la cuenta del usuario con identificador 'id'.
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
 *         description: Devuelve una lista de seguidores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Seguidores'
 *       500:
 *         description: Error del servidor al obtener los usuarios
 *
 */

router.get("/:id/seguidores", ctrlUsuarioSocial.obtenerSeguidores);

/**
 * @swagger
 * /api/users/{id}/seguidos:
 *   get:
 *     summary: Devuelve los seguidos de la cuenta.
 *     tags:
 *       - Social
 *     description: Devuelve una lista con los seguidos de la cuenta del usuario con identificador 'id'.
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
 *         description: Devuelve una lista de seguidores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Seguidores'
 *       500:
 *         description: Error del servidor al obtener los usuarios
 *
 */
router.get("/:id/seguidos", ctrlUsuarioSocial.obtenerSeguidos);

/**
 * @swagger
 * /api/users/{id}/seguidores:
 *   post:
 *     summary: Permite seguir a una cuenta.
 *     tags:
 *       - Social
 *     description: La cuenta del usuario con identificador 'id' empezará a seguir la cuenta del usuario introducido como parámetro
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que quiere realizar el seguimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             $ref : '#definitions/UserInfo'
 *     responses:
 *       201:
 *         description: Devuelve el usuario con el nuevo seguido añadido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   $ref : '#definitions/UserInfo'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: El usuario no existe
 *       409:
 *         description: No es posible realizar la acción
 *       500:
 *         description: Error del servidor al obtener los usuarios
 *
 */

router.post(
	"/:id/seguidores",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	ctrlUsuarioSocial.seguirUsuario
);

/**
 * @swagger
 * /api/users/{id}/seguidores:
 *   delete:
 *     summary: Permite dejar de seguir una cuenta.
 *     tags:
 *       - Social
 *     description: La cuenta del usuario con identificador 'id' dejará de seguir la cuenta del usuario introducido como parámetro
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que quiere dejar de realizar el seguimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             $ref : '#definitions/UserInfo'
 *     responses:
 *       204:
 *         description: Devuelve una respuesta vacía
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Alguno de los usuarios no ha sido encontrado
 *       500:
 *         description: Error del servidor al obtener los usuarios
 *
 */

router.delete(
	"/:id/seguidores",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	ctrlUsuarioSocial.dejarSeguirUsuario
);

/**
 * @swagger
 * /api/users/buscar/usuario:
 *   get:
 *     summary: Devuelve perfiles de usuario que coincidan con la busqueda.
 *     tags:
 *       - Social
 *     description: Devuelve una lista de perfiles de usuario que coincidan con la busqueda.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: nombreUsuario
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: nombre del usuario a buscar
 *     responses:
 *       200:
 *         description: Devuelve una lista de perfiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: Contiene el reparto que ha participado en la película
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del usuario
 *                     example: 66360a27725483113f5dafd8
 *                   username:
 *                     type: string
 *                     description: nombre de usuario
 *                     example: adrianarribas241
 *                   imagen:
 *                     type: string
 *                     description: foto de perfil
 *                     example: https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=1734
 *                   email:
 *                     type: string
 *                     description: email del perfil 
 *                     example: adrian24@gmail.com
 *                   baneado:
 *                     type: boolean
 *                     description: indica si el usuario esta baneado o no
 *                     example: false
 *       500:
 *         description: Error del servidor al obtener los usuarios
 *
 */
router.get("/buscar/usuario", ctrlUsuarioSocial.buscarUsuario);

// ---------------- REVIEWS ---------------------

/**
 * @swagger
 * /api/users/{id}/reviews:
 *   get:
 *     summary: Obtiene las reviews de un usuario.
 *     tags:
 *       - Review
 *     description: Obtiene la lista de reviews realizadas por el usuario con identificador 'id'.
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
 *         description: Devuelve una lista de reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: número de reviews totales que ha hecho el usuario
 *                   example: 1
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref : '#definitions/Review'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al obtener los usuarios
 *
 */

router.get("/:id/reviews", ctrlUsuario.obtenerReviewsPorUsuario);
router.get("/:id/review/:reviewId", ctrlUsuario.obtenerReviewDeUsuario);

/**
 * @swagger
 * /api/users/{id}/reviews/tipo:
 *   get:
 *     summary: Obtiene las reviews de un usuario clasificadas por tipo de media.
 *     tags:
 *       - Review
 *     description: Obtiene la lista de reviews realizadas por el usuario con identificador 'id' clasificadas por tipo de media.
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
 *         description: Devuelve una lista de reviews clasificadas por tipo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviewsPeliculas:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: número de reviews sobre películas que tiene
 *                       example: 1
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref : '#definitions/Review'
 *                 reviewsMusica:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: número de reviews sobre música que tiene
 *                       example: 1
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref : '#definitions/Review'
 *                 reviewsLibros:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: número de reviews sobre libros que tiene
 *                       example: 1
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref : '#definitions/Review'
 *                 reviewsVideojuegos:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: número de reviews sobre videojuegos que tiene
 *                       example: 1
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref : '#definitions/Review'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al obtener los usuarios
 *
 */

router.get("/:id/reviews/tipo", ctrlUsuario.obtenerReviewsPorUsuarioPorTipo);

/**
 * @swagger
 * /api/users/{id}/reviews:
 *   post:
 *     summary: Permite que un usuario añada una review a su perfil
 *     tags:
 *       - Review
 *     description: Permite que el usuario con identificador 'id' añada una review a su perfil
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 $ref : '#definitions/Media'
 *               descripcion:
 *                 type: string
 *                 description: Opinión que el usuario tiene acerca de la media a valorar.
 *                 example: Me encanta, realmente lo recomiendo
 *               calificacion:
 *                 type: integer
 *                 description: Valoración del 0 al 5 que el usuario le da a la media consumida.
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4
 *               mediaRecuerda:
 *                 type: array
 *                 description: Contiene las medias que le recuerdan a la media a valorar.
 *                 items:
 *                   $ref : '#definitions/Media'
 *
 *     responses:
 *       201:
 *         description: Devuelve la review añadida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 media:
 *                   type: object
 *                   properties:
 *                     tipo:
 *                       type: string
 *                       description: Tipo de multimedia
 *                       enum: [pelicula, videojuego, libro, musica]
 *                       example: pelicula
 *                     idMedia:
 *                       type: string
 *                       description: ID de la multimedia
 *                       example: 666277
 *                     nombre:
 *                       type: string
 *                       description: título de la media
 *                       example: Vidas pasadas
 *                     imagen:
 *                       type: string
 *                       description: portada de la media
 *                       example: https://image.tmdb.org/t/p/w1280/jWrJrLMD7SZoxc65KSYej6QOw12.jpg
 *                 descripcion:
 *                   type: string
 *                   description: Opinión que el usuario tiene acerca de la media a valorar.
 *                   example: Me encanta, realmente lo recomiendo
 *                 calificacion:
 *                   type: integer
 *                   description: Valoración del 0 al 5 que el usuario le da a la media consumida.
 *                   minimum: 0
 *                   maximum: 5
 *                   example: 4
 *                 mediaRecuerda:
 *                   type: array
 *                   description: Contiene las medias que le recuerdan a la media a valorar.
 *                   items:
 *                     $ref : '#definitions/Media'
 *
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.post(
	"/:id/reviews",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	getToken,
	ctrlUsuario.anadirReview
);

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}:
 *   put:
 *     summary: Actualiza una review del sistema.
 *     tags:
 *       - Review
 *     description: Actualiza la review cuyo identificador es 'idReview' realizada por el usuario con identificador 'id'.
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               media:
 *                 $ref : '#definitions/Media'
 *               descripcion:
 *                 type: string
 *                 description: Opinión que el usuario tiene acerca de la media a valorar.
 *                 example: Me encanta, realmente lo recomiendo
 *               calificacion:
 *                 type: integer
 *                 description: Valoración del 0 al 5 que el usuario le da a la media consumida.
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4
 *               mediaRecuerda:
 *                 type: array
 *                 description: Contiene las medias que le recuerdan a la media a valorar.
 *                 items:
 *                   $ref : '#definitions/Media'
 *     responses:
 *       201:
 *         description: Devuelve la review añadida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 media:
 *                   type: object
 *                   properties:
 *                     tipo:
 *                       type: string
 *                       description: Tipo de multimedia
 *                       enum: [pelicula, videojuego, libro, musica]
 *                       example: pelicula
 *                     idMedia:
 *                       type: string
 *                       description: ID de la multimedia
 *                       example: 666277
 *                     nombre:
 *                       type: string
 *                       description: título de la media
 *                       example: Vidas pasadas
 *                     imagen:
 *                       type: string
 *                       description: portada de la media
 *                       example: https://image.tmdb.org/t/p/w1280/jWrJrLMD7SZoxc65KSYej6QOw12.jpg
 *                 descripcion:
 *                   type: string
 *                   description: Opinión que el usuario tiene acerca de la media a valorar.
 *                   example: Me encanta, realmente lo recomiendo
 *                 calificacion:
 *                   type: integer
 *                   description: Valoración del 0 al 5 que el usuario le da a la media consumida.
 *                   minimum: 0
 *                   maximum: 5
 *                   example: 4
 *                 mediaRecuerda:
 *                   type: array
 *                   description: Contiene las medias que le recuerdan a la media a valorar.
 *                   items:
 *                     $ref : '#definitions/Media'
 *
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.put(
	"/:id/reviews/:idReview",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	ctrlUsuario.actualizarReview
);
/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}:
 *   delete:
 *     summary: Permite eliminar una review
 *     tags:
 *       - Review
 *     description: Permite que el usuario con identificador 'id' elimine su review con identificador 'idReview'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review que desea eliminar
 *     responses:
 *       204:
 *         description: Devuelve una respuesta vacía
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario o review no encontrada
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.delete(
	"/:id/reviews/:idReview",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserIdOrAdmin,
	ctrlUsuario.eliminarReview
);

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}:
 *   get:
 *     summary: Obtiene una review del sistema
 *     tags:
 *       - Review
 *     description: Obtiene la review con identificador 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review
 *     responses:
 *       200:
 *         description: Devuelve un mensaje de éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref : '#definitions/Review'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario o Review no encontrada
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.get("/:id/reviews/:idReview", ctrlUsuarioReview.obtenerReviewPorId);

// --------------- MÁS TARDE ------------------

/**
 * @swagger
 * /api/users/{id}/masTarde:
 *   get:
 *     summary: Obtiene las multimedias que el usuario quiere consumir más tarde
 *     tags:
 *       - MasTarde
 *     description: Obtiene las multimedias que el usuario con identificador 'id' quiere consumir más tarde
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
 *         description: Devuelve un conjunto de medias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/MediaRecordar'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.get(
	"/:id/masTarde",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	ctrlUsuarioMasTarde.obtenerMediaEnMasTarde
);

/**
 * @swagger
 * /api/users/{id}/masTarde:
 *   post:
 *     summary: Permite añadir una multimedia a la lista para consumir más tarde
 *     tags:
 *       - MasTarde
 *     description: Permite que el usuario con identificador 'id' añada una multimedia a la lista para consumir más tarde
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         raw:
 *           schema:
 *             type: object
 *             properties:
 *               mediaRecordar:
 *                 $ref : '#definitions/MediaRecordar'
 *     responses:
 *       201:
 *         description: Devuelve un mensaje de éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/MediaRecordar'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.post(
	"/:id/masTarde",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	ctrlUsuarioMasTarde.anadirMediaAMasTarde
);

/**
 * @swagger
 * /api/users/{id}/masTarde/{idMedia}:
 *   delete:
 *     summary: Permite eliminar una multimedia de la lista de multimedias consumir más tarde
 *     tags:
 *       - MasTarde
 *     description: Permite que el usuario con identificador 'id' elimine una multimedia de la lista de multimedias para consumir más tarde
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario
 *       - in: path
 *         name: idMedia
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la media a eliminar
 *     responses:
 *       204:
 *         description: Devuelve una respuesta vacía
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

router.delete(
	"/:id/masTarde/:idMedia",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	ctrlUsuarioMasTarde.eliminarMediaDeMasTarde
);


// -------------- LIKES DE REVIEW ----------------

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}/like:
 *   post:
 *     summary: Permite que el usuario dé 'me gusta' a una review
 *     tags:
 *       - Review
 *     description: Permite que el usuario que ha iniciado sesión dé 'me gusta' a la review con identificador 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que creó la review
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review que el usuario quiere dar 'me gusta'
 *     responses:
 *       201:
 *         description: Devuelve la review a la que ha dado like
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Review'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario o review no encontrada
 *       409:
 *         description: Ya ha dado like a esta review
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.post(
	"/:id/reviews/:idReview/like",
	authMiddleware.verifyToken,
	ctrlUsuarioReview.darLikeReview
);

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}/like:
 *   delete:
 *     summary: Permite que el usuario quite el 'me gusta' de una review
 *     tags:
 *       - Review
 *     description: Permite que el usuario que ha iniciado sesión quite el 'me gusta' a la review con identificador 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que creó la review
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review que el usuario quiere quitar el 'me gusta'
 *     responses:
 *       204:
 *         description: Devuelve respuesta vacía
 *       400:
 *         description: El usuario no ha dado 'me gusta' a la review
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario o review no encontrada
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.delete(
	"/:id/reviews/:idReview/like",
	authMiddleware.verifyToken,
	ctrlUsuarioReview.quitarLikeReview
);

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}/like:
 *   get:
 *     summary: Permite obtener los likes de una review
 *     tags:
 *       - Review
 *     description: Permite obtener los likes de la review con identificador 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que creó la review
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review
 *     responses:
 *       200:
 *         description: Devuelve los usuarios que han dado like a la review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: número de usuarios que han dado like a la review
 *                   example: 1
 *                 likesReview:
 *                   type: array
 *                   items:
 *                     $ref : '#definitions/Like'
 *       403:
 *         description: Usuario no disponible
 *       404:
 *         description: Usuario o review no encontrada
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.get(
	"/:id/reviews/:idReview/like",
	ctrlUsuarioReview.obtenerLikesDeReview
);

// ------------- COMENTARIOS DE REVIEW ------------

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}/comentarios:
 *   post:
 *     summary: Permite añadir un comentario a la review
 *     tags:
 *       - Review
 *     description: Permite que el usuario que ha iniciado sesión añada un comentario a la review con identificador 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que creó la review
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review en la que se va a añadir el comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comentario:
 *                 type: string
 *                 description: Opinion que el usuario tiene acerca de la review
 *                 example: no coincido contigo
 *     responses:
 *       201:
 *         description: Devuelve un mensaje de éxito
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario o review no encontrada
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.post(
	"/:id/reviews/:idReview/comentarios",
	authMiddleware.verifyToken,
	ctrlUsuarioReview.comentarReview
);

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}/comentarios/{idComentario}:
 *   delete:
 *     summary: Permite eliminar un comentario de una review
 *     tags:
 *       - Review
 *     description: Permite que el usuario que ha iniciado sesión elimine su comentario con identificador 'idComentario' de la review con identificador 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que creó la review
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review en la que está incluido el comentario
 *       - in: path
 *         name: idComentario
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del comentario que desea eliminar
 *     responses:
 *       204:
 *         description: Devuelve respuesta vacía
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario o review o comentario no encontrada
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.delete(
	"/:id/reviews/:idReview/comentarios/:idComentario",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserIdOrAdmin,
	ctrlUsuarioReview.eliminarComentarioReview
);

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}/comentarios:
 *   get:
 *     summary: Obtiene los comentarios de una review
 *     tags:
 *       - Review
 *     description: Obtiene la lista de comentarios existentes en la review con identificador 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que creó la review
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review en la que está incluido el comentario
 *     responses:
 *       200:
 *         description: Devuelve una lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref : '#definitions/Comentario'
 *       403:
 *         description: Usuario no disponible
 *       404:
 *         description: Usuario o review no encontrada
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.get(
	"/:id/reviews/:idReview/comentarios",
	ctrlUsuarioReview.obtenerComentariosPorReview
);

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}/comentarios/{idComentario}:
 *   get:
 *     summary: Obtiene un comentario del sistema
 *     tags:
 *       - Review
 *     description: Obtiene el comentario con identificador 'idComentario' añadido en la review con identificador 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que creó la review
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review en la que está incluido el comentario
 *       - in: path
 *         name: idComentario
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Devuelve un comentario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref : '#definitions/Comentario'
 *       403:
 *         description: Usuario no disponible
 *       404:
 *         description: Usuario o review o comentario no encontrado
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.get(
	"/:id/reviews/:idReview/comentarios/:idComentario",
	ctrlUsuarioReview.obtenerComentariosPorId
);

// ---------- LIKES DE COMENTARIOS DE REVIEW -----------

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}/comentarios/{idComentario}/like:
 *   post:
 *     summary: Permite dar 'me gusta' a un comentario de una review
 *     tags:
 *       - Review
 *     description: Permite que el usuario que ha iniciado sesión dé 'me gusta' al comentario con id 'idComentario' de la review 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que creó la review
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review en la que está incluido el comentario
 *       - in: path
 *         name: idComentario
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del comentario al que desea dar 'me gusta'
 *     responses:
 *       200:
 *         description: Devuelve el comentario con el 'me gusta' añadido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref : '#definitions/Comentario'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario o review o comentario no encontrado
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.post(
	"/:id/reviews/:idReview/comentarios/:idComentario/like",
	authMiddleware.verifyToken,
	ctrlUsuarioReview.darLikeComentarioReview
);

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}/comentarios/{idComentario}/like:
 *   delete:
 *     summary: Permite eliminar un 'me gusta' de un comentario de una review
 *     tags:
 *       - Review
 *     description: Permite que eliminar el 'me gusta' que el usuario ha dado al comentario con id 'idComentario' de la review 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que creó la review
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review en la que está incluido el comentario
 *       - in: path
 *         name: idComentario
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del comentario al que desea quitar el 'me gusta'
 *     responses:
 *       204:
 *         description: Devuelve una respuesta vacía
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario o review o comentario no encontrado
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.delete(
	"/:id/reviews/:idReview/comentarios/:idComentario/like",
	authMiddleware.verifyToken,
	ctrlUsuarioReview.eliminarLikeComentarioReview
);

/**
 * @swagger
 * /api/users/{id}/reviews/{idReview}/comentarios/{idComentario}/like:
 *   get:
 *     summary: Obtiene los 'me gusta' que tiene una review
 *     tags:
 *       - Review
 *     description: Obtiene la lista de 'me gusta' que tiene el comentario con identificador 'idComentario' añadido en la review con identificador 'idReview' creada por el usuario con identificador 'id'
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del usuario que creó la review
 *       - in: path
 *         name: idReview
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID de la review en la que está incluido el comentario
 *       - in: path
 *         name: idComentario
 *         required: false # DEBERÍA SER TRUE PERO SINO NO FUNCIONA
 *         type: ObjectId
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Devuelve una lista de likes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: número de usuarios que han dado like al comentario de la review
 *                   example: 1
 *                 likesComentarioReview:
 *                   type: object
 *                   $ref : '#definitions/Like'
 *
 *       404:
 *         description: Usuario o review o comentario no encontrado
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.get(
	"/:id/reviews/:idReview/comentarios/:idComentario/like",
	ctrlUsuarioReview.obtenerLikesEnComentarioDeReview
);

// --------------- NOTIFICACIONES ----------------

/**
 * @swagger
 * /api/users/{id}/notificaciones:
 *   get:
 *     summary: Obtiene las notificaciones de un usuario
 *     tags:
 *       - Notificacion
 *     description: Obtiene la lista de notificaciones del usuario con identificador 'id'
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
 *         description: Devuelve una lista de notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: número de notificaciones de nuevo seguimiento recibidas
 *                   example: 1
 *                 notificaciones:
 *                   type: array
 *                   items:
 *                     $ref : '#definitions/Notificacion'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.get(
	"/:id/notificaciones",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	ctrlNotificaciones.obtenerNotificacionesPorUsuario
);

/**
 * @swagger
 * /api/users/{id}/notificaciones/tipo:
 *   get:
 *     summary: Obtiene las notificaciones de un usuario clasificadas por tipo
 *     tags:
 *       - Notificacion
 *     description: Obtiene la lista de notificaciones del usuario con identificador 'id' clasificadas por tipo
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
 *         description: Devuelve una lista de notificaciones clasificadas por tipo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notificacionesNuevoSeguidor:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: número de notificaciones de nuevo seguimiento recibidas
 *                       example: 1
 *                     notificaciones:
 *                       type: array
 *                       items:
 *                         $ref : '#definitions/Notificacion'
 *                 notificacionesComentarioReview:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: número de notificaciones de nuevo comentario en review recibidas
 *                       example: 1
 *                     notificaciones:
 *                       type: array
 *                       items:
 *                         $ref : '#definitions/Notificacion'
 *                 notificacionesLikeReview:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: número de notificaciones de nuevo like en review recibidas
 *                       example: 1
 *                     notificaciones:
 *                       type: array
 *                       items:
 *                         $ref : '#definitions/Notificacion'
 *                 notificacionesLikeComentario:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: número de notificaciones de nuevo like en comentario recibidas
 *                       example: 1
 *                     notificaciones:
 *                       type: array
 *                       items:
 *                         $ref : '#definitions/Notificacion'
 *       403:
 *         description: El usuario no tiene permiso para realizar la accion
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al obtener el usuario
 *
 */

router.get(
	"/:id/notificaciones/tipo",
	authMiddleware.verifyToken,
	authMiddleware.tokenMatchesUserId,
	ctrlNotificaciones.obtenerNotificacionesPorUsuarioPorTipo
);

module.exports = router;

//incluimos el modelo de usuarios
const usuarioModelo = require("../models/usuario");
const logger = require("../../logger");
// función para obtener las medias incluidas en el más tarde de un usuario
async function obtenerMediaEnMasTarde(req, res) {
    logger.info("user.mastarde.controller: obtener media en mas tarde");
    try {
        const usuario = await usuarioModelo.findById(req.params.id); // Busca el usuario en concreto
        if (!usuario) {
            logger.error("user.mastarde.controller:usuario no encontrado");
            return res.status(404).send("Usuario no encontrado");
        } // En caso de que no exista el usuario enviamos un error

        const respuesta = {
            count: usuario.masTarde.length, // Cuenta el número de medias encontradas
            medias: usuario.masTarde, // Incluye el array de medias en la respuesta
        };
        res.json(respuesta); // Envía el objeto respuesta en formato JSON
    } catch (err) {
        logger.error(
            "user.mastarde.controller:Error al obtener la media en mas tarde"
        );
        res.status(500).send("Error al obtener los usuarios");
    }
}

// función para añadir una media a más tarde
async function anadirMediaAMasTarde(req, res) {
    logger.info("user.mastarde.controller:añadir media a mas tarde");
    try {
        let mediaYaIncluida = false;

        // buscamos el usuario en el sistema
        const usuario = await usuarioModelo.findById(req.params.id);
        if (!usuario) {
            logger.error("user.mastarde.controller:usuario no encontrado");
            return res.status(404).send("Usuario no encontrado");
        }

        if (usuario.masTarde.length > 0) {
            usuario.masTarde.forEach((e) => {
                
                
                if (e.media.idMedia == req.body.masTarde.media.idMedia) {
                    mediaYaIncluida = true;
                }
            });
        }
        if (mediaYaIncluida) {
            logger.error("user.mastarde.controller:ya has añadido esta media");
            return res.status(409).send("Ya has añadido esta media");
        } else {
            usuario.masTarde.push(req.body.masTarde);

            // guardamos la información actualizada
            const actualizarDatos = await usuarioModelo.findByIdAndUpdate(
                req.params.id,
                usuario
            );

            return res.status(201).send(usuario.masTarde);
        }
    } catch (err) {
        logger.error(
            "user.mastarde.controller:error del servidor al añadir media a mas tarde"
        );
        res.status(500).send("Error del servidor al obtener los usuarios");
    }
}

// función para eliminar una media a más tarde
async function eliminarMediaDeMasTarde(req, res) {
    logger.info("user.mastarde.controller:eliminar media de mas tarde");
    try {
        let mediaEncontrada = false;

        // buscamos el usuario en el sistema
        const usuario = await usuarioModelo.findById(req.params.id);
        if (!usuario) {
            logger.error("user.mastarde.controller:usuario no encontrado");
            return res.status(404).send("Usuario no encontrado");
        }

        // buscamos la media a eliminar
        for (i = 0; i < usuario.masTarde.length; i++) {
            if (usuario.masTarde[i]._id == req.params.idMedia) {
                mediaEncontrada = true;
                break;
            }
        }

        if (!mediaEncontrada) {
            logger.error("user.mastarde.controller:media no encontrada");
            return res.status(404).send("Media no encontrada");
        }

        // eliminamos la media del vector
        usuario.masTarde.splice(i, 1);

        // guardamos la información actualizada
        const actualizarDatos = await usuarioModelo.findByIdAndUpdate(
            req.params.id,
            usuario
        );

        return res.status(204).send("Petición completada");
    } catch (err) {
        console.error(err.message);
        logger.error(
            "user.mastarde.controller:error del servidor al eliminar media de mas tarde"
        );
        res.status(500).send("Error del servidor al obtener los usuarios");
    }
}

module.exports = {
    obtenerMediaEnMasTarde,
    anadirMediaAMasTarde,
    eliminarMediaDeMasTarde,
};

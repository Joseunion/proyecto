var jwt = require('jsonwebtoken');
const usuarioModelo = require("../models/usuario");

function verifyToken (req, res, next){
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined'){
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		var decoded = jwt.verify(bearerToken, 'clavesecreta');
		req.token=decoded
		
		next()
	}
	else res.status(403).send("token no verificado")
}

function tokenMatchesUserId (req, res, next){
	const token = req.token.idUsuario;
	if (token == req.params.id){
		next()
	}
	else res.status(403).send("el usuario no tiene permiso para realizar esta acción");
}

async function tokenMatchesUserIdOrAdmin (req, res, next){
	const usuario = await usuarioModelo.findById(req.token.idUsuario); // Encuentra el usuario
	const token = req.token.idUsuario;
	
	if (token == req.params.id){
		
		next()
	}
	else if(usuario.admin){
		next()
	}
	else res.status(403).send("el usuario no tiene permiso para realizar esta acción");
}

module.exports = {verifyToken, tokenMatchesUserId, tokenMatchesUserIdOrAdmin}

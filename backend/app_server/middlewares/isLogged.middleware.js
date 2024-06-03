var jwt = require("jsonwebtoken");

function isLogged(req, res, next) {
	const bearerHeader = req.headers["authorization"];
	if (bearerHeader) {
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		var decoded = jwt.verify(bearerToken, "clavesecreta");
		req.token = decoded;
		
	}
	next();
}

module.exports = { isLogged };

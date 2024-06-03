const spotifyToken = require("../utils/getSpotifyToken");

async function getToken(req, res, next) {
	
	req.spotifyToken = await spotifyToken.getSpotifyToken();
	next();
}

module.exports = { getToken };

async function getSpotifyToken() {
	
	const url = "https://accounts.spotify.com/api/token";
	const response = await fetch(url, {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body:
			"grant_type=client_credentials&client_id=" +
			process.env.CLIENT_ID_SPOTIFY +
			"&client_secret=" +
			process.env.CLIENT_SECRET_ID_SPOTIFY, // body data type must match "Content-Type" header
	});
	const responseJson = await response.json();
	return responseJson.access_token;
}

module.exports = { getSpotifyToken };

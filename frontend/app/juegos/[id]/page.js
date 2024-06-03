"use client";
import CustomNavbar from "../../(components)/navbar";
import CardCentral from "../../(components)/cardCentral";
import MediaGrande from "@/app/(components)/mediaGrande";
import { useEffect, useState } from "react";

export default function Juego({ params: { id } }) {
	const [videojuegoInfo, setVideojuegoInfo] = useState(undefined);

	const endpointGetVideojuego =
		process.env.NEXT_PUBLIC_BACKEND_URL + "api/videojuegos/" + id;

	useEffect(() => {
		fetch(endpointGetVideojuego)
			.then((response) => response.json())
			.then((data) => setVideojuegoInfo(data));
	}, []);

	const JuegoPage = () => {
		if (videojuegoInfo == undefined) return;
		return (
			<>
				<MediaGrande m={videojuegoInfo} />
			</>
		);
	};

	return (
		<>
			<CustomNavbar isLogged={true} />
			<CardCentral Content={<JuegoPage />} />
		</>
	);
}

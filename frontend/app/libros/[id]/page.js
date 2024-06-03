"use client";
import CustomNavbar from "../../(components)/navbar";
import CardCentral from "../../(components)/cardCentral";
import MediaGrande from "@/app/(components)/mediaGrande";
import { useEffect, useState } from "react";

export default function Libro({ params: { id } }) {
	const [libroInfo, setLibroInfo] = useState(undefined);

	const endpointGetLibro =
		process.env.NEXT_PUBLIC_BACKEND_URL + "api/libros/" + id;

	useEffect(() => {
		fetch(endpointGetLibro)
			.then((response) => response.json())
			.then((data) => setLibroInfo(data));
	}, []);

	const LibroPage = () => {
		if (libroInfo == undefined) return;
		return (
			<>
				<MediaGrande m={libroInfo} />
			</>
		);
	};

	return (
		<>
			<CustomNavbar isLogged={true} />
			<CardCentral Content={<LibroPage />} />
		</>
	);
}

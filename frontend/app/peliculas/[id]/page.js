"use client";
import CustomNavbar from "../../(components)/navbar";
import CardCentral from "../../(components)/cardCentral";
import MediaGrande from "@/app/(components)/mediaGrande";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Pelicula({ params: { id } }) {
	const session = useSession()
	const [peliculaInfo, setPeliculaInfo] = useState(undefined);

	const endpointGetPelicula =
		process.env.NEXT_PUBLIC_BACKEND_URL + "api/peliculas/" + id;

	useEffect(() => {
		if (session.status=="authenticated")
			fetch(endpointGetPelicula, 
				{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.data.user.token}`,
				},
			}
			)
				.then((response) => response.json())
				.then((data) => setPeliculaInfo(data));
		else if (session.status=="unauthenticated"){
			fetch(endpointGetPelicula)
				.then((response) => response.json())
				.then((data) => setPeliculaInfo(data));
		}
	}, [session]);

	const PeliculaPage = () => {
		if (peliculaInfo == undefined) return;
		return (
			<>
				<MediaGrande m={peliculaInfo} />
			</>
		);
	};

	return (
		<>
			<CustomNavbar isLogged={true} />
			<CardCentral Content={<PeliculaPage />} />
		</>
	);
}

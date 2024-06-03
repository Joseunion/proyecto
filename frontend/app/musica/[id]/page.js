"use client";
import CustomNavbar from "../../(components)/navbar";
import CardCentral from "../../(components)/cardCentral";
import MediaGrande from "@/app/(components)/mediaGrande";
import { useEffect, useState } from "react";

export default function Musica({ params: { id } }) {
	const [musicaInfo, setMusicaInfo] = useState(undefined);

	const endpointGetAlbum =
		process.env.NEXT_PUBLIC_BACKEND_URL + "api/musica/album/" + id;

	useEffect(() => {
		fetch(endpointGetAlbum)
			.then((response) => response.json())
			.then((data) => setMusicaInfo(data));
	}, []);

	const MusicaPage = () => {
		if (musicaInfo == undefined) return;
		return (
			<>
				<MediaGrande m={musicaInfo} />
			</>
		);
	};

	return (
		<>
			<CustomNavbar isLogged={true} />
			<CardCentral Content={<MusicaPage />} />
		</>
	);
}

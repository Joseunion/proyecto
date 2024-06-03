"use client";
import CustomNavbar from "../(components)/navbar";
import CardCentral from "../(components)/cardCentral";
import ReviewGrande from "../(components)/reviewGrande";
import MediaMasTarde from "../(components)/mediaMasTarde";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Loader from "../(components)/loader";

export default function Paramastarde() {
    const urlsSegunTipo = {
        libro: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/libros/`,
        videojuegos: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/videojuegos/`,
        pelicula: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/peliculas/`,
        musica: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/musica/album/`,
        videojuego: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/videojuegos/`,
    };
    const [loading, setLoading] = useState(true)
    const [mediaRecuerda, setMediaRecuerda] = useState([]);
    const session = useSession();

    const getMediaMasTarde = async () => {
        if (session.status === "authenticated") {
            const resMasTarde = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${session.data.user.id}/masTarde`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session.data.user.token}`,
                    },
                }
            );

            const masTarde = await resMasTarde.json();
            const masTardeCompleto = await Promise.all(
                masTarde.medias.map(async (m) => {
                    const mediaMasTarde = await fetch(
                        urlsSegunTipo[m.media.tipo] + m.media.idMedia,
                        {
                            method: "GET",
                        }
                    );
                    const prueba = await mediaMasTarde.json();
                    return {
                        idUsuario: session.data.user.id,
                        idMediaRecuerda: m._id,
                        ...prueba,
                    };
                })
            );
            
            setMediaRecuerda(masTardeCompleto);
            setLoading(false)
        }
    };

    useEffect(() => {
        getMediaMasTarde();
    }, [session]);

    const ParamastardePage = () => {
        return (
            <>
                <h1 className="fw-semibold">RemindsMeOf</h1>
                <hr className="border-2" />
                <h3 className="fw-semibold">Para más tarde</h3>
                {mediaRecuerda.map((m) => {
                    return (
                        <MediaMasTarde
                            key={m._id}
                            m={m}
                            update={() => {
                                getMediaMasTarde();
                            }}
                        />
                    );
                })}
            </>
        );
    };

    if (session.status !== "loading" && !loading)
        return (
            <>
                <CustomNavbar isLogged={true} />
                <CardCentral Content={<ParamastardePage />} />
            </>
        );
    else return <Loader></Loader>
}

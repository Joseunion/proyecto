"use client";
import CustomNavbar from "./(components)/navbar";
import CardCentral from "./(components)/cardCentral";
import ReviewGrande from "./(components)/reviewGrande";
import Loader from "./(components)/loader";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const session = useSession();

    const getTimeline = async () => {
        if (session.status === "authenticated") {
            const resLogin = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/timeline`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session.data.user.token}`,
                    },
                }
            );
            setTimeline(await resLogin.json());
            setLoading(false)
        }
        else if (session.status === "unauthenticated") {
            const resLogin = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/timeline`,
            );
            setTimeline(await resLogin.json());
            setLoading(false)
        }
    };

    useEffect(() => {
        getTimeline();
    }, [session]);

    const HomePage = () => {
        if (session.status !== "loading" && !loading) {
            return (
                <>
                    <h1 className="fw-semibold">RemindsMeOf</h1>
                    <hr className="border-2" />
                    <h3 className="fw-semibold">Últimas reviews</h3>
                    {timeline.map((r) => {
                        return <ReviewGrande key={r._id} r={r} updateReview={() => getTimeline()}/>;
                    })}
                </>
            );
        } else {
            return <Loader />; // Mostrar el Loader mientras se carga la página
        }
    };

    if (session.status != "loading" && !loading)
        return (
            <>
                <CustomNavbar />
                <CardCentral Content={<HomePage />} />
            </>
        );
    else {
        return <Loader />; // Mostrar el Loader mientras se carga la sesión
    }
}

'use client'
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {getStationETA} from "@/lib/utils";

export default function ConfirmButtons() {
    const [ETA, setETA] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coordsArray = [pos.coords.longitude, pos.coords.latitude];

                    getStationETA(coordsArray.join()).then((eta) => {
                        setETA(eta ? eta : null);
                        setLoading(false);
                    });
                },
                (err) => {
                    console.error("Error fetching location:", err)
                    setLoading(false);
                }
            );
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div className="flex w-full flex-col gap-5">
            <p className="text-2xl pt-2">Kvittera</p>

            <Button type="button" variant={"destructive"} size={"lg"} disabled={loading || ETA === null}>
                <p className="text-2xl">{loading ? "Beräknar körtid..." : ETA ? `ETA: ${ETA} minuter` : 'Kunde inte hämta position'}</p>
            </Button>
            <Button type="button" variant={"destructive"} size={"lg"}><p className="text-2xl">5 min</p></Button>
            <Button type="button" variant={"destructive"} size={"lg"}><p className="text-2xl">10 min</p></Button>
            <Button type="button" variant={"destructive"} size={"lg"}><p className="text-2xl">15 min</p></Button>
            <Button type="button" variant={"secondary"} size={"lg"}><p className="text-2xl">Far direkt</p></Button>
        </div>
    )
}
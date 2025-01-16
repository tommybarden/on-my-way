'use client'
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {getStationETA} from "@/utils/helpers";

export default function ConfirmButtons(props: any) {
    const [ETA, setETA] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const confirmAlarm = (id: number, minutes: number) => {
        alert('Larm ' + id + ', ' + minutes + 'minuter')
    }

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
            ,{
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 120 * 1000
            });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div className={props.className + ' p-4'}>
            <div className="flex w-full flex-col gap-5">
                <strong>Kvittera</strong>

                <Button onClick={() => { confirmAlarm(props.alarmId, ETA ?? 0)}} type="button" variant={"destructive"} size={"lg"} disabled={loading || ETA === null}>
                    <p className="text-2xl">{loading ? "Beräknar körtid..." : ETA ? `ETA: ${ETA} minuter` : 'Kunde inte hämta position'}</p>
                </Button>
                <Button onClick={() => { confirmAlarm(props.alarmId, 5)}} type="button" variant={"destructive"} size={"lg"}><p className="text-2xl">5 min</p></Button>
                <Button onClick={() => { confirmAlarm(props.alarmId, 10)}} type="button" variant={"destructive"} size={"lg"}><p className="text-2xl">10 min</p></Button>
                <Button onClick={() => { confirmAlarm(props.alarmId, 15)}} type="button" variant={"destructive"} size={"lg"}><p className="text-2xl">15 min</p></Button>
                <Button onClick={() => { confirmAlarm(props.alarmId, -1)}} type="button" variant={"secondary"} size={"lg"}><p className="text-2xl">Far direkt</p></Button>
            </div>
        </div>
    )
}
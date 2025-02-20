'use client'
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {getStationETA} from "@/utils/helpers";
import {useRouter} from "next/navigation";
import {confirmAlarm} from "@/services/client/alarms";

export default function ConfirmButtons(props: { userId: string, alarmId: number; className?: string; }) {
    const [ETA, setETA] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();

    const updateETA = async () => {
        if (navigator.geolocation) {
            setLoading(true);
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
                , {
                    enableHighAccuracy: true,
                    timeout: 6000,
                    maximumAge: 120 * 1000
                });
        } else {
            setLoading(false);
        }
    }

    const confirm = (minutes: number) => {
        setSubmitting(true)
        confirmAlarm(props.alarmId, minutes, props?.userId ?? '')
            .then(r => {
                console.log(r)
                setSubmitting(false)

                if (window) {
                    window.scrollTo({
                        top: 1000,
                        left: 0,
                        behavior: "smooth",
                    });
                }

                router.refresh()
            })
            .catch(() => {
                alert('Ett fel uppstod. Försök igen!')
                setSubmitting(false)
            })
    }

    useEffect(() => {
        updateETA();
    }, []);

    return (
        <div className={props.className + ' p-4'}>
            <div className="flex w-full flex-col gap-5">
                <strong>Kvittera</strong>

                <Button onClick={() => {
                    confirm(ETA ?? 0)
                }} type="button" variant={"destructive"} size={"lg"} disabled={submitting || loading || ETA === null}>
                    <p className="text-2xl">{loading ? "Beräknar körtid..." : ETA ? `ETA: ${ETA} minuter` : 'Kunde inte hämta position'}</p>
                </Button>
                <Button onClick={() => {
                    confirm(5)
                }} type="button" variant={"destructive"} size={"lg"} disabled={submitting}>
                    <p className="text-2xl">5 min</p>
                </Button>
                <Button onClick={() => {
                    confirm(10)
                }} type="button" variant={"destructive"} size={"lg"} disabled={submitting}>
                    <p className="text-2xl">10 min</p>
                </Button>
                <Button onClick={() => {
                    confirm(15)
                }} type="button" variant={"destructive"} size={"lg"} disabled={submitting}>
                    <p className="text-2xl">15 min</p>
                </Button>
                <Button onClick={() => {
                    confirm(-1)
                }} type="button" variant={"secondary"} size={"lg"} disabled={submitting}>
                    <p className="text-2xl">Far direkt</p>
                </Button>
            </div>
        </div>
    )
}
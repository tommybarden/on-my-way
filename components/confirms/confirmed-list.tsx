'use client'

import { calculateConfirmed, getConfirmed } from "@/services/alarms";
import { removeSubscription, subscribeToConfirmed } from "@/services/subscriptions";
import { User } from "@/utils/types";
import { Clock, Flame, Landmark, Merge, MoveRight, Truck, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConfirmedList(props: { users: Record<string, User>; alarmId: number; className?: string; }) {
    const [confirmed, setConfirmed] = useState<any[]>([]);
    const { users, alarmId, className } = props;

    useEffect(() => {
        if (!alarmId) return;

        const fetchConfirmed = async () => {
            const confirmed = await getConfirmed(alarmId);

            if (confirmed) {
                const calculatedData = calculateConfirmed(confirmed);
                setConfirmed(calculatedData);
            }
        };

        fetchConfirmed();

        // Sätt upp subscription när komponenten mountas
        const subscription = subscribeToConfirmed((payload) => {
            const newData = payload.new; // Ny data (vid INSERT/UPDATE)
            const oldData = payload.old; // Gammal data (vid DELETE/UPDATE)

            setConfirmed((prevData) => {
                if (newData && oldData) {
                    // Uppdatera befintlig rad
                    return calculateConfirmed(
                        prevData.map(item => item.id === oldData.id ? newData : item)
                    );
                }
                if (newData) {
                    // Lägg till ny rad
                    return calculateConfirmed([...prevData, newData]);
                }
                if (oldData) {
                    // Ta bort gammal rad
                    return calculateConfirmed(prevData.filter(item => item.id !== oldData.id));
                }
                return prevData;
            });
        });

        // Interval för att uppdatera nedräkningen varje sekund
        const interval = setInterval(() => {
            setConfirmed(prevState => {
                if (!prevState) return prevState;
                const updatedData = prevState.map(row => {
                    const updatedRow = { ...row };
                    if (updatedRow.timeLeft > 0) {
                        updatedRow.timeLeft -= 1;  // Minska timeLeft varje sekund
                    }
                    return updatedRow;
                });
                return updatedData;
            });
        }, 1000);

        // Rensa upp när komponenten tas bort
        return () => {
            removeSubscription(subscription)
            clearInterval(interval);  // Rensa intervallet
        };

    }, [alarmId, users]); // Uppdatera om alarmId eller users ändras

    if (!confirmed) {
        return <p>Laddar...</p>;
    }

    // Hjälpfunktion för att formatera tid kvar
    const formatTime = (timeLeft: number) => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const groups = [
        { title: "far direkt", icon: Merge, color: "text-blue-500", data: confirmed.filter(c => c.minutes < 0) },
        { title: "på station", icon: UserCheck, color: "text-green-500", data: confirmed.filter(c => c.minutes >= 0 && c.timeLeft <= 0) },
        { title: "på väg", icon: Clock, color: "text-orange-500", data: confirmed.filter(c => c.timeLeft > 0).sort((a, b) => a.timeLeft - b.timeLeft) }
    ];

    return (
        <div className={className + ' p-4 lg:text-3xl xl:text-4xl'}>
            <div className="flex w-full flex-col gap-5">
                <strong>Insatsstyrka</strong>

                {groups.map(({ title, icon: Icon, color, data }) => (
                    data.length > 0 && (
                        <div key={title}>
                            <div className="text-lg font-bold mt-4 flex items-center justify-center gap-2">
                                <Icon className={`w-6 h-6 ${color}`} />{data.length}&nbsp;{title}
                            </div>
                            <ul role="list" className="divide-y divide-gray-100">
                                {data.map((confirm, i) => {
                                    const user = users[confirm.created_by];
                                    return (
                                        <li key={i} className="flex items-center justify-between py-3 gap-3 xl:py-5">
                                            <div className="flex flex-row gap-1 items-center">
                                                <span className="truncate max-w-full max-w-1/3">{user?.first_name} {user?.last_name}</span>
                                                <span>{user?.truck ? <Truck className="w-5 h-5 opacity-80" color="#4783B5" strokeWidth={1} /> : ""}</span>
                                                <span>{user?.smoke ? <Flame className="w-5 h-5 opacity-50" fill="#FF4D00" strokeWidth={0} /> : ""}</span>
                                            </div>
                                            <span style={{ fontFamily: 'Courier New, monospace' }}>
                                                {confirm.timeLeft > 0 ? formatTime(confirm.timeLeft) : ""}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

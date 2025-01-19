'use client'

import { calculateConfirmed, getConfirmed } from "@/services/alarms";
import { removeSubscription, subscribeToConfirmed } from "@/services/subscriptions";
import { User } from "@/utils/types";
import { useEffect, useState } from "react";

export default function ConfirmedList(props: { users: Record<string, User>; alarmId: number; className?: string; }) {
    const [confirmed, setConfirmed] = useState<any[]>([]);
    const { users, alarmId, className } = props;

    //TODO: Fixa visibilitychange-listener så räknaren blir på rätt

    useEffect(() => {
        if (!alarmId) return;

        const fetchConfirmed = async () => {
            const confirmed = await getConfirmed(alarmId);

            if(confirmed) {
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

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchConfirmed();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Rensa upp när komponenten tas bort
        return () => {
            removeSubscription(subscription)
            clearInterval(interval);  // Rensa intervallet
            document.removeEventListener('visibilitychange', handleVisibilityChange);
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

    return (
        <div className={className + ' p-4'}>
            <div className="flex w-full flex-col gap-5">
                <strong>Insatsstyrka</strong>
                <ul role="list" className="divide-y divide-gray-100">
                    {confirmed.map((confirm, i) => {
                        const user = users[confirm.created_by];  // Hämta användarens data
                        return (
                            <li key={i} className="flex items-center justify-between py-3">
                                <span>{user?.first_name} {user?.last_name}</span>
                                <span style={{ fontFamily: 'Courier New, monospace' }}>
                                {confirm.timeLeft > 0 ? formatTime(confirm.timeLeft) : confirm.minutes < 0 ? "Far direkt 🚙" : "På station 🚒"}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                
            </div>
        </div>
    );
}

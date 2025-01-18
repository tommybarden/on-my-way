'use client'

import { calculateConfirmed, getConfirmed } from "@/services/alarms";
import { User, ConfirmedResponse } from "@/utils/types";
import { useEffect, useState } from "react";

export default function ConfirmedList(props: { users: Record<string, User>; alarmId: number; className?: string; }) {
    const [confirmed, setConfirmed] = useState<ConfirmedResponse[] | null>(null);
    //const [timer, setTimer] = useState<any>([]);
    //const [users, setUsers] = useState<Record<string, User>>({});
    const { users, alarmId, className } = props;

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
            //supabase.removeSubscription(responseSubscription);
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
                                {confirm.timeLeft > 0 ? formatTime(confirm.timeLeft) : confirm.minutes < 0 ? "Far direkt" : "På station"}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

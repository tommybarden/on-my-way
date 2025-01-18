"use client";

import { removeSubscription, subscribeToAlarms } from "@/services/subscriptions";
import { useEffect, useState } from "react";

export default function NoAlarmListener() {
    const [alarm, setAlarm] = useState(null);

    useEffect(() => {
        const subscription = subscribeToAlarms((newAlarm) => {
            console.log("Nytt larm upptäckt!", newAlarm);
            setAlarm(newAlarm);

            // Ladda om sidan automatiskt
            setTimeout(() => {
                window.location.reload();
            }, 500); // Vänta 0,5 sek för att undvika race conditions
        });

        return () => {
            removeSubscription(subscription) // Avsluta prenumerationen vid unmount
        };
    }, []);

    return <div>Inget pågående larm...</div>;
}

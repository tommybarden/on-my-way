"use client";

import { removeSubscription, subscribeToAlarms } from "@/services/subscriptions";
import { useEffect } from "react";

export default function AlarmListener() {
    useEffect(() => {
        const subscription = subscribeToAlarms((newAlarm) => {
            console.log("Ändring av larm upptäckt!", newAlarm);
    
            // Ladda om sidan automatiskt
            setTimeout(() => {
                window.location.reload();
            }, 500); // Vänta 0,5 sek för att undvika race conditions
        });
    
        return () => {
            removeSubscription(subscription); // Avsluta prenumerationen vid unmount
        };
    }, []);

    return '';
}

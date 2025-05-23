"use client";

import { removeSubscription, subscribeToAlarms } from '@/services/client/subscriptions';
import { useEffect } from "react";

export default function AlarmListener() {

    useEffect(() => {

        const reloadPage = () => {
            setTimeout(() => {
                console.log('Laddar om!');
                window.location.reload();
                //router.refresh()
            }, 500); // Vänta 0,5 sek för att undvika race conditions
        }

        const autoReloadInterval = setInterval(() => {
            reloadPage();
        }, 43200000); // 12 timmar

        const subscription = subscribeToAlarms((newAlarm) => {
            console.log("Ändring av larm upptäckt!", newAlarm);

            reloadPage()
        });

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                reloadPage()
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            removeSubscription(subscription);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(autoReloadInterval);
        };

    }, []);

    return '';
}

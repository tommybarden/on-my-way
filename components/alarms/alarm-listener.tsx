"use client";

import { removeSubscription, subscribeToAlarms } from '@/services/client/subscriptions';
import { useRouter } from 'next/navigation'
import { useEffect } from "react";

export default function AlarmListener() {

    const router = useRouter();

    useEffect(() => {

        const reloadPage = () => {
            setTimeout(() => {
                //window.location.reload();
                router.refresh()
            }, 500); // Vänta 0,5 sek för att undvika race conditions
        }

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
        };

    }, [router]);

    return '';
}

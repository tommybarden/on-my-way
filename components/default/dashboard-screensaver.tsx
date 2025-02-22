'use client'
import { getStationStatus } from "@/services/client/log";
import { removeSubscription, subscribeToStationEvents } from "@/services/client/subscriptions";
import { useEffect, useState } from "react";

export default function ScreenSaver() {
    const [isInactive, setIsInactive] = useState(false);

    useEffect(() => {

        document.body.classList.toggle('hidden', isInactive);
        document.documentElement.classList.toggle('cursor-none', isInactive);

        const getStatus = async () => {
            const status = await getStationStatus()

            setIsInactive('active' !== status)
        }

        const subscription = subscribeToStationEvents((payload) => {
            const newData = payload.new;

            if (newData) {
                console.log(newData)

                setIsInactive('active' !== newData.message)
            }
        })

        getStatus();

        return () => {
            removeSubscription(subscription)
        };
    }, [isInactive]);

    return null
}
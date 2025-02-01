"use client";

import { savePushSubscription } from "@/services/client/push";
import { Button } from "../ui/button";
import { Bell, BellRing } from "lucide-react";
import { useEffect, useState } from "react";

export default function EnablePushButton() {
    const [subscribed, setSubscribed] = useState(false);

    const ICON_SIZE = 16;

    async function requestPushSubscription() {

        try {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                alert("Push-notiser stöds inte i denna webbläsare.");
                return;
            }

            const registration = await navigator.serviceWorker.ready;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY // VAPID-nyckel från push-server
            });

            const saved = await savePushSubscription(JSON.stringify(subscription))

            setSubscribed(!!saved);

        } catch (error) {
            console.error("Push-prenumeration misslyckades:", error);
            alert("Kunde inte aktivera push-notiser.");
        }
    }

    async function checkExistingSubscription() {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            return null;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        return subscription;
    }

    useEffect(() => {
        checkExistingSubscription().then((subscription) => {
            if (subscription) {
                setSubscribed(true); // Uppdatera UI
            }
        });
    }, []);

    return (
        <Button variant="ghost" size={"sm"} onClick={requestPushSubscription} disabled={subscribed}>
            {subscribed ? <BellRing size={ICON_SIZE} /> : <Bell size={ICON_SIZE} />}
        </Button>
    );
}

"use client";

import {Button} from "../ui/button";
import {Bell, BellRing} from "lucide-react";
import {useState} from "react";

export default function EnablePushButton() {
    const [subscribed, setSubscribed] = useState(false);

    const ICON_SIZE = 16;

    async function requestPushSubscription() {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            alert("Push-notiser stöds inte i denna webbläsare.");
            return;
        }

        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY // VAPID-nyckel från push-server
        });

        console.log(subscription);

        //     const registration = await navigator.serviceWorker.ready;
        //     const subscription = await registration.pushManager.subscribe({
        //         userVisibleOnly: true,
        //         applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY // VAPID-nyckel från push-server
        //     });

        //     const {data: {user}} = await supabase.auth.getUser();
        //     if (!user) {
        //         alert("Du måste vara inloggad för att aktivera push-notiser.");
        //         return;
        //     }

        //     await fetch("/api/saveSubscription", {
        //         method: "POST",
        //         body: JSON.stringify({userId: user.id, subscription}),
        //         headers: {"Content-Type": "application/json"}
        //     });

        setSubscribed(true);
    }

    return (
        <Button variant="ghost" size={"sm"} onClick={requestPushSubscription} disabled={subscribed}>
            {subscribed ? <BellRing size={ICON_SIZE}/> : <Bell size={ICON_SIZE}/>}
        </Button>
    );
}

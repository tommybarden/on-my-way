"use client";
import {useState} from "react";
import {createClient} from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,);

export default function EnablePushButton() {
    const [subscribed, setSubscribed] = useState(false);

    async function requestPushSubscription() {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            alert("Push-notiser stöds inte i denna webbläsare.");
            return;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY // VAPID-nyckel från push-server
        });

        const {data: {user}} = await supabase.auth.getUser();
        if (!user) {
            alert("Du måste vara inloggad för att aktivera push-notiser.");
            return;
        }

        await fetch("/api/saveSubscription", {
            method: "POST",
            body: JSON.stringify({userId: user.id, subscription}),
            headers: {"Content-Type": "application/json"}
        });

        setSubscribed(true);
    }

    return (
        <button onClick={requestPushSubscription} disabled={subscribed}>
            {subscribed ? "Push-notiser aktiverade!" : "Aktivera push-notiser"}
        </button>
    );
}

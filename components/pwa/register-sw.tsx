"use client";
import {useEffect} from "react";
import {Workbox} from "workbox-window";

export default function RegisterServiceworker() {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            const wb = new Workbox("/sw.js");
            wb.register()
                .then(reg => console.log("✅ Service Worker registrerad!", reg))
                .catch(err => console.error("❌ Service Worker misslyckades", err));
        }
    }, []);

    return null;
}

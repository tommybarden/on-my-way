'use client'
import {useEffect, useState} from "react";

export default function ScreenSaver() {
    const [isInactive, setIsInactive] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsInactive(true); // Aktivera skärmsläckaren efter 5 sekunder
        }, 5000); // Tiden är 5000 ms (5 sekunder)

        // När isInactive ändras, sätt eller ta bort klassen "hidden"
        if (isInactive) {
            document.body.classList.add('hidden');
        } else {
            document.body.classList.remove('hidden');
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [isInactive]);

    return null
}
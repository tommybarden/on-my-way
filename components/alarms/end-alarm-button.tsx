"use client";

import { Button } from "@/components/ui/button";

export default function EndAlarmButton() {
    const endAlarmFn = async () => {
        if (window.confirm("Är du säker på att du vill avsluta?")) {

            const response = await fetch("/api/station-event/alarm-off", {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                alert("Något gick fel, försök igen.");
            }

            window.location.reload();
        }
    };

    return (
        <Button
            className="my-4"
            type="button"
            variant={"destructive"}
            size={"lg"}
            onClick={endAlarmFn}
        >
            <p className="text-2xl">Avsluta pågående larm</p>
        </Button>
    );
}

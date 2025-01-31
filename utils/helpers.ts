import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrettyDateOptions, Response, Unit } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/////

//   const statusTexts: StatusTexts = {
//     0: "Inaktiv",
//     1: "Pågående",
//     2: "Avslutad",
//   };

//   const getStatusText = (status: number) => statusTexts[status] || "-";

/////

export const filterUnits = (input: string, own: boolean): string => {
    const units = input.split(',').map(unit => unit.trim());

    return units.filter(unit => own ? unit.startsWith('J1') : !unit.startsWith('J1')).join(', ');
}

export const prettyDate = (isoDate: string, options: PrettyDateOptions = { date: true, time: false }): string => {
    const date = new Date(isoDate);
    const { date: includeDate, time: includeTime } = options;

    const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short",
    });

    const timeFormatter = new Intl.DateTimeFormat("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
        //second: "2-digit",
    });

    const dateString = includeDate ? dateFormatter.format(date) : "";
    const timeString = includeTime ? "kl. " + timeFormatter.format(date) : "";

    return [dateString, timeString].filter(Boolean).join(" "); // Kombinera med ett mellanslag
};

export const getStationETA = async (lonlat: string) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTESERVICE_KEY ?? ''
    const station = process.env.NEXT_PUBLIC_STATION_COORDINATES ?? '';
    const endpoint = `https://api.openrouteservice.org/v2/directions/driving-car`;

    console.log(lonlat)

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${apiKey}`
            },
            body: JSON.stringify({
                coordinates: [lonlat.split(','), station.split(',')],
                radiuses: 1000,
                instructions: false,
            }),
            //signal: AbortSignal.timeout(5000)
        });
        const data = await response.json();

        if (data?.routes[0]?.summary) {
            const durationInSeconds = data?.routes[0]?.summary.duration;
            const durationInMinutes = Math.round(durationInSeconds / 60);
            console.log(`Restid: ${durationInMinutes} minuter`);
            return durationInMinutes;
        } else return false;
    } catch (error) {
        console.error("Error fetching ORS route:", error);
        return false;
    }

}

export const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const calculateConfirmed = (responses: Response[]) => {
    const now = Date.now();

    return responses.map((row) => {

        const createdAt = new Date(row.created_at);

        const arrivalTime = new Date(createdAt);
        if (row.minutes >= 0) {
            arrivalTime.setMinutes(arrivalTime.getMinutes() + row.minutes);
        }

        let timeLeft = Math.floor((arrivalTime.getTime() - now) / 1000);

        if (timeLeft < 0) {
            timeLeft = 0;
        }

        return { ...row, arrivalTime, timeLeft };
    })
        .sort((a, b) => {

            if (a.minutes < 0 && b.minutes >= 0) {
                return -1;
            } else if (a.minutes >= 0 && b.minutes < 0) {
                return 1;
            }

            return +a.arrivalTime - +b.arrivalTime;
        });
};

export const calculateStartedUnits = (units: Unit[]) => {
    const now = Date.now();

    return units.map((row) => {
        const started = new Date(row.created_at);
        const timeSince = Math.floor((now - started.getTime()) / 1000);

        return { ...row, timeSince };
    })
}

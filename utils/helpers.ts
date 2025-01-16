import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type PrettyDateOptions = {
    date?: boolean; // Inkludera datum
    time?: boolean; // Inkludera tid
};

export const prettyDate = (isoDate: string, options: PrettyDateOptions = {date: true, time: false}): string => {
    const date = new Date(isoDate);
    const {date: includeDate, time: includeTime} = options;

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
            })
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
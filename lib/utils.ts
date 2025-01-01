import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PrettyDateOptions = {
  date?: boolean; // Inkludera datum
  time?: boolean; // Inkludera tid
};

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
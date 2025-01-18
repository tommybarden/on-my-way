import { Alarm, Response } from "@/utils/types";
import { createClient } from "@/utils/supabase/client";

export const getOngoingAlarm = async () => {
    const supabase = createClient();

    const { data: current_alarm, error } = await supabase
        .from<string, Alarm>('Alarms')
        .select('*')
        .eq('status', 1)
        .limit(1)
        .single()

    return current_alarm ?? false
}

export const confirmAlarm = async (alarm_id: number, minutes: number) => {
    const supabase = createClient();

    try {
            const { data, error } = await supabase
                .from('Responses')
                .insert([
                    { 
                        alarm_id, 
                        minutes
                    },
                ])
                .select()

          if(error) {
            return false
        }

        return data

    } catch (e) {
        console.error(e)
    }

}

export const getConfirmed = async (alarm_id: number) => {
    const supabase = createClient();

    const { data: responses, error } = await supabase
        .from('Responses')
        .select('*')
        .order('created_at')
        .eq('alarm_id', alarm_id)

    if(!responses) {
        return []
    }

    return responses
}

export const calculateConfirmed = (responses: Response[]) => {
    return responses.map((row) => {
        // Skapa en Date-objekt från created_at
        const createdAt = new Date(row.created_at);

        // Justera för tidszonen, om användaren är på väg via station, lägg till minuter
        const arrivalTime = new Date(createdAt);
        if (row.minutes >= 0) {
            arrivalTime.setMinutes(arrivalTime.getMinutes() + row.minutes);
        }

        // Få aktuell tid i millisekunder
        const now = Date.now();

        // Beräkna tid kvar i sekunder
        let timeLeft = Math.floor((arrivalTime.getTime() - now) / 1000);

        // Om användaren borde vara framme (timeLeft < 0), sätt timeLeft till 0
        if (timeLeft < 0) {
            timeLeft = 0;
        }

        return { ...row, arrivalTime, timeLeft };
    })
    .sort((a, b) => {
        // Först, sortera de med negativa "minutes" först
        if (a.minutes < 0 && b.minutes >= 0) {
            return -1; // A åker direkt, sätt A först
        } else if (a.minutes >= 0 && b.minutes < 0) {
            return 1; // B åker direkt, sätt B först
        }

        // Om både A och B har samma "minutes" (eller båda är >= 0 eller båda < 0), sortera efter arrivalTime
        return +a.arrivalTime - +b.arrivalTime;
    });
};
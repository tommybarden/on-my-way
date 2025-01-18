import { Alarm } from "@/utils/types";
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

export const calculateConfirmed = (responses:{ created_at: string, minutes: number, created_by: string }[]) => {
    return responses.map((row) => {
        const arrivalTime = new Date(new Date(row.created_at).getTime() - new Date().getTimezoneOffset() * 60000);
        const now = new Date().getTime();
        let timeLeft = 0

        if(row.minutes >= 0) { //Kommer via station
            arrivalTime.setMinutes(arrivalTime.getMinutes() + row.minutes);
            timeLeft = Math.floor((arrivalTime.getTime() - now) / 1000)
        }

        if (timeLeft < 0) { // Borde va framme
            timeLeft = 0;
        }
        
        return { ...row, arrivalTime, timeLeft };
    })
    .sort((a, b) => +a.arrivalTime - +b.arrivalTime);
}


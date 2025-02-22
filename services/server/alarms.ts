import { createAdminClient } from "@/utils/supabase/server";
import { Alarm } from "@/utils/types";

export const upsertAlarm = async (alarm: object) => {
    try {
        const supabase = createAdminClient();

        const alarmData = Object.fromEntries(
            Object.entries(alarm).filter(([_, value]) => value !== undefined && value !== null && value !== "")
        )

        const { data: current_alarm, error } = await supabase
            .from('Alarms')
            .select('id')
            .lt('status', 2)
            .limit(1)
            .maybeSingle();

        if (!current_alarm || error) { //No ongoing alarm in db. Create a new one
            const defaultAlarm = {
                description: "Virve",
                location: "Ingen plats angiven",
                units: process.env.DEFAULT_UNITS || 'J11, J12, J14, J15, J17',
                geo: "",
                status: 1,
            };

            const { data, error } = await supabase
                .from('Alarms')
                .insert([{ ...defaultAlarm, ...alarmData }])
                .select();

            if (error) throw error;
            return data;
        }

        if (current_alarm) { //Found one, update it
            const { data, error } = await supabase
                .from('Alarms')
                .update(alarmData)
                .eq('id', current_alarm.id)
                .select()

            if (error) throw error;
            return data;
        }

    } catch (e) {
        console.error("Error in upsertAlarm:", e);
        return null;
    }
}

export const createAlarm = async (description: string, location: string, units: string) => {
    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from('Alarms')
            .insert([{ description, location, units, status: 1 }])
            .select();

        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Error in createAlarm:", e);
        return null;
    }
};

export const cancelAlarm = async () => {
    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from('Alarms')
            .update({ status: 0 })
            .eq('status', 1)
            .select();

        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Error in cancelAlarm:", e);
        return null;
    }
};

export const endAlarm = async () => {
    try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
            .from('Alarms')
            .update({ status: 2 })
            .neq('status', 2)
            .select();

        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Error in endAlarm:", e);
        return null;
    }
};

export const getFinishedAlarms = async () => {
    try {
        const supabase = createAdminClient();

        const { data: alarms, error } = await supabase
            .from<string, Alarm>('Alarms')
            .select('*')
            .eq('status', 2)
            .order('created_at', { ascending: false })
            .limit(10)

        if (error) throw error;

        return alarms;
    } catch (e) {
        console.error("Error in getFinishedAlarms:", e);
        return null;
    }
}

import { createAdminClient } from "@/utils/supabase/server";
import { Alarm } from "@/utils/types";

export const upsertAlarm = async (alarm: Partial<Alarm>) => {
    try {
        const supabase = createAdminClient();

        const defaultAlarm: Alarm = {
            description: "Virve",
            location: "Ingen plats angiven",
            units: process.env.DEFAULT_UNITS || 'J11, J12, J14, J15, J17',
            geo: "",
            status: 1,
        };

        //Remove unset rows
        const alarmData = Object.fromEntries(
            Object.entries(alarm).filter(([_, value]) =>
                value !== undefined && value !== null && value !== ""
            )
        );

        const { data: current_alarm, error } = await supabase
            .from('Alarms')
            .select('*')
            .lt('status', 2)
            .limit(1)
            .maybeSingle();

        if (!current_alarm || error) {
            const { data, error } = await supabase
                .from('Alarms')
                .insert([{ ...defaultAlarm, ...alarmData }])
                .select();

            if (error) throw error;
            return data;
        }

        if (current_alarm) {
            //Replace default values
            const updateData = { ...alarmData };

            for (const key of Object.keys(current_alarm) as Array<keyof Alarm>) {
                if (current_alarm[key] === defaultAlarm[key] && alarm[key]) {
                    updateData[key] = alarm[key];
                }
            }

            const { data, error } = await supabase
                .from('Alarms')
                .update(updateData)
                .eq('id', current_alarm.id)
                .select();

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

export const getLatestAlarm = async () => {
    try {
        const supabase = createAdminClient();

        const { data: alarms, error } = await supabase
            .from<string, Alarm>('Alarms')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (error) throw error;

        return alarms;
    } catch (e) {
        console.error("Error in getLatestAlarm:", e);
        return null;
    }
}

export const getAlarmById = async (id: string) => {
    try {
        const supabase = createAdminClient();

        const { data: alarms, error } = await supabase
            .from<string, Alarm>('Alarms')
            .select('*')
            .eq('id', id)
            .limit(1)
            .single()

        if (error) throw error;

        return alarms;
    } catch (e) {
        console.error("Error in getAlarmById:", e);
        return null;
    }
}

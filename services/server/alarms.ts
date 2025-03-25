import {createAdminClient} from "@/utils/supabase/server";
import {Alarm} from "@/utils/types";

export const upsertAlarm = async (alarm: Partial<Alarm>) => {
    try {
        const supabase = createAdminClient();

        const defaultAlarm: Alarm = {
            description: "Virve",
            location: "Ingen plats angiven",
            units: process.env.DEFAULT_UNITS?.trim() || 'J11, J12, J14, J15, J17, M3, POLIS',
            geo: "",
            status: 1,
        };

        // Remove unset rows
        const alarmData = Object.fromEntries(
            Object.entries(alarm).filter(([_, value]) =>
                value !== undefined && value !== null && value !== ""
            )
        );

        const {data: current_alarm, error} = await supabase
            .from('Alarms')
            .select('*')
            .eq('status', 1)
            .order('created_at', {ascending: false})
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("Error fetching current alarm:", error);
            throw error;
        }

        if (!current_alarm) {
            const {data, error} = await supabase
                .from('Alarms')
                .insert([{...defaultAlarm, ...alarmData}])
                .select();

            if (error) throw error;
            return data;
        }

        // Update the existing alarm
        const updateData = {...alarmData};

        for (const key of Object.keys(current_alarm) as Array<keyof Alarm>) {
            if (current_alarm[key] === defaultAlarm[key] && alarm[key] !== undefined) {
                updateData[key] = alarm[key];
            }
        }

        const {data, error: updateError} = await supabase
            .from('Alarms')
            .update(updateData)
            .eq('id', current_alarm.id)
            .select();

        if (updateError) throw updateError;
        return data;

    } catch (e) {
        console.error("Error in upsertAlarm:", e);
        return null;
    }
}

export const insertAlarm = async (alarm: Partial<Alarm>) => {
    const supabase = createAdminClient();

    const defaultAlarm: Alarm = {
        description: "Virve",
        location: "Ingen plats angiven",
        units: process.env.DEFAULT_UNITS || 'J11, J12, J14, J15, J17, M3, POLIS',
        geo: "",
        status: 1,
    };

    const alarmData = Object.fromEntries(
        Object.entries(alarm).filter(([_, value]) =>
            value !== undefined && value !== null && value !== ""
        )
    );

    const {data, error} = await supabase
        .from('Alarms')
        .insert([{...defaultAlarm, ...alarmData}])
        .select();

    if (error) throw error;
    return data;
};

export const updateAlarm = async (alarm: Partial<Alarm>) => {
    const supabase = createAdminClient();

    const updateData = Object.fromEntries(
        Object.entries(alarm).filter(([_, value]) =>
            value !== undefined && value !== null && value !== ""
        )
    );

    const {data, error} = await supabase
        .from('Alarms')
        .update(updateData)
        .eq('status', 1)
        .order('created_at', {ascending: false})
        .limit(1)
        .select();

    if (error) throw error;
    return data;
};

export const createAlarm = async (description: string, location: string, units: string) => {
    try {
        const supabase = createAdminClient();
        const {data, error} = await supabase
            .from('Alarms')
            .insert([{description, location, units, status: 1}])
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
        const {data, error} = await supabase
            .from('Alarms')
            .update({status: 0})
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
        const {data, error} = await supabase
            .from('Alarms')
            .update({status: 2})
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

        // @ts-ignore
        const {data: alarms, error} = await supabase
            .from<string, Alarm>('Alarms')
            .select('*')
            .eq('status', 2)
            .order('created_at', {ascending: false})
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

        const {data: alarms, error} = await supabase
            .from<string, Alarm>('Alarms')
            .select('*')
            .order('created_at', {ascending: false})
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

        // @ts-ignore
        const {data: alarms, error} = await supabase
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

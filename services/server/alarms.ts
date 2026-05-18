import {createAdminClient} from "@/utils/supabase/server";
import {Alarm} from "@/utils/types";

export const upsertAlarm = async (alarm: Partial<Alarm>) => {
    const supabase = createAdminClient();

    const defaultAlarm: Alarm = {
        description: "Virve",
        location: "Ingen plats angiven",
        units: process.env.DEFAULT_UNITS?.trim() || 'J11, J12, J14, J15, J17, M3, POLIS',
        geo: "",
        status: 1,
    };

    const alarmData = Object.fromEntries(
        Object.entries(alarm).filter(([_, v]) =>
            v !== undefined && v !== null && v !== ""
        )
    );

    const recently = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // 1. Always try update first
    const {data: updated, error: updateError} = await supabase
        .from('Alarms')
        .update(alarmData)
        .eq('status', 1)
        .gte('created_at', recently)
        .select();

    if (updateError) throw updateError;

    if (updated && updated.length > 0) {
        return updated;
    }

    // 2. If nothing updated → try create
    const {data: inserted, error: insertError} = await supabase
        .from('Alarms')
        .insert([{...defaultAlarm, ...alarmData}])
        .select();

    if (insertError) {
        if (insertError.code === '23505') {
            // lost race → someone else created it → retry update once
            const {data: retry, error: retryError} = await supabase
                .from('Alarms')
                .update(alarmData)
                .eq('status', 1)
                .gte('created_at', recently)
                .select();

            if (retryError) throw retryError;
            return retry;
        }

        throw insertError;
    }

    return inserted;
};

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

        const {data: alarms, error} = await supabase
            .from('Alarms')
            .select('*')
            .eq('status', 2)
            .order('created_at', {ascending: false})
            .limit(10)

        if (error) throw error;

        return alarms as Alarm[];
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

        const {data: alarms, error} = await supabase
            .from('Alarms')
            .select('*')
            .eq('id', id)
            .limit(1)
            .single()

        if (error) throw error;

        return alarms as Alarm[];
    } catch (e) {
        console.error("Error in getAlarmById:", e);
        return null;
    }
}

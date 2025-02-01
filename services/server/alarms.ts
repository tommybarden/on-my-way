import { createAdminClient } from "@/utils/supabase/server";

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


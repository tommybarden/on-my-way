import { createClient } from "@/utils/supabase/client";

export const getOngoingAlarm = async () => {
    try {
        const supabase = createClient();
        const { data: current_alarm, error } = await supabase
            .from('Alarms')
            .select('*')
            .lt('status', 2)
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        return current_alarm;
    } catch (e) {
        console.error("Error in getOngoingAlarm:", e);
        return null;
    }
};

export const isCanceledAlarm = async () => {
    try {
        const supabase = createClient();
        const { data: canceled, error } = await supabase
            .from('Alarms')
            .select('id')
            .eq('status', 0)
            .limit(1)
            .maybeSingle();

        if (error) throw error;
        return !!canceled;
    } catch (e) {
        console.error("Error in isCanceledAlarm:", e);
        return false;
    }
};

export const confirmAlarm = async (alarm_id: number, minutes: number, user: string) => {
    try {
        const supabase = createClient();

        // Radera befintligt svar, hantera eventuellt fel
        const { error: deleteError } = await supabase
            .from('Responses')
            .delete()
            .eq('created_by', user)
            .eq('alarm_id', alarm_id);

        if (deleteError) throw deleteError;

        const { data, error } = await supabase
            .from('Responses')
            .insert([{ alarm_id, minutes }])
            .select();

        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Error in confirmAlarm:", e);
        return null;
    }
};

export const getConfirmed = async (alarm_id: number) => {
    try {
        const supabase = createClient();
        const { data: responses, error } = await supabase
            .from('Responses')
            .select('*')
            .order('created_at')
            .eq('alarm_id', alarm_id);

        if (error) throw error;
        return responses ?? [];
    } catch (e) {
        console.error("Error in getConfirmed:", e);
        return [];
    }
};

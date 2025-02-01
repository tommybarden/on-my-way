import { createClient } from "@/utils/supabase/client";

export const getStartedUnits = async (alarm_id: number) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('Unit_starts')
        .select('*')
        .eq('alarm_id', alarm_id)
        .order('created_at')

    if (error) {
        return []
    }

    return data
}


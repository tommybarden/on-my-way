import { Alarm } from "@/utils/types";
import { createClient } from "@/utils/supabase/server";

export const getOngoingAlarm = async () => {

    const supabase = await createClient();

    let { data: current_alarm, error } = await supabase
        .from<string, Alarm>('Alarms')
        .select('*')
        .eq('status', 1)
        .limit(1)
        .single()

    return current_alarm ?? false
}
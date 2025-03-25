import {createClient} from "@/utils/supabase/server";
import {Alarm} from "@/utils/types";

export const unitStarting = async (unit: string) => {
    const supabase = await createClient();

    try {
        const {data: current_alarm} = await supabase
            .from<string, Alarm>('Alarms')
            .select('id')
            .lt('status', 2)
            .limit(1)
            .single()

        if (!current_alarm) {
            console.log('No alarm')
            return false
        }

        const alarm_id = current_alarm?.id;

        // @ts-ignore
        const {data: already_left} = await supabase
            .from<string, Alarm>('Unit_starts')
            .select('id')
            .eq('alarm_id', alarm_id)
            .eq('unit', unit)
            .limit(1)
            .single()

        if (already_left) {
            console.log('Already left')
            return false
        }

        const {data, error} = await supabase
            .from('Unit_starts')
            .insert([
                {
                    alarm_id,
                    unit
                },
            ])
            .select()

        if (error) {
            console.log('Failed when saving')
            console.log(error)
            return false
        }

        return data

    } catch (e) {
        console.error(e)
    }
}



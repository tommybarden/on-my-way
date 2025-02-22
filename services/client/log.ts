import { createClient } from "@/utils/supabase/client";

export const getStationStatus = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('Log')
        .select('message')
        .in('message', ['active', 'all-off'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        return ''
    }

    return data.message
}


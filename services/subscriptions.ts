import { createClient } from "@/utils/supabase/client";

export const subscribeToConfirmed = (callback: (payload: any) => void) => {
    const supabase = createClient();
    
    return supabase.channel('all-responses-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'Responses' }, (payload) => {
            callback(payload)
        }
        )
        .subscribe()
};
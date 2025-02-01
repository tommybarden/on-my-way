import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export const subscribeToConfirmed = (callback: (payload: any) => void) => {
    const supabase = createClient();

    return supabase.channel('all-responses-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'Responses' }, (payload) => {
            callback(payload)
        })
        .subscribe()
};

export const subscribeToAlarms = (callback: (payload: any) => void) => {
    const supabase = createClient();

    return supabase.channel('all-alarm-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'Alarms', filter: 'status=eq.1' }, (payload: any) => {
            callback(payload)
        })
        .subscribe()
};

export const subscribeToUnitsStarting = (callback: (payload: any) => void) => {
    const supabase = createClient();

    return supabase.channel('all-units-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'Unit_starts' }, (payload: any) => {
            callback(payload)
        })
        .subscribe()
};

export const removeSubscription = (channel: RealtimeChannel) => {
    const supabase = createClient();
    return supabase.removeChannel(channel);
}
import { createClient } from "@/utils/supabase/client";

export const savePushSubscription = async (subscription: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !subscription) {
        return false
    }

    // Kolla om prenumerationen redan finns
    const { data: existingSub, error: fetchError } = await supabase
        .from('Push_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .single(); // Hämta en rad om den finns

    const { data, error } = await supabase
        .from('Push_subscriptions')
        .upsert([
            existingSub ? {
                id: existingSub,
                user_id: user?.id,
                subscription
            } : {
                user_id: user?.id,
                subscription
            },
        ])
        .select()

    if (error) {
        console.log(error)
        return false
    }

    return data
}
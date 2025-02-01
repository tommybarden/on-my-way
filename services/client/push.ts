import { createClient } from "@/utils/supabase/client";

export const savePushSubscription = async (subscription: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !subscription) {
        return false
    }

    const { data: existingSub, error: fetchError } = await supabase
        .from('Push_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('subscription', subscription)
        .single();

    if (existingSub) {
        return existingSub;
    }

    const { data, error } = await supabase
        .from('Push_subscriptions')
        .insert([
            {
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
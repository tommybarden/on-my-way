"use server"
import webpush from "web-push";
import { createClient } from "@/utils/supabase/server"

export const sendNotification = async (title: string, body: string) => {

    const supabase = await createClient()

    const { data: subscribers, error } = await supabase
        .from('Push_subscriptions')
        .select('subscription')

    if (error || !subscribers) {
        return false
    }

    webpush.setVapidDetails(
        process.env.NEXT_PUBLIC_VAPID_SUBJECT!,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
    );

    subscribers?.forEach(({ subscription }) => {
        webpush.sendNotification(subscription, JSON.stringify({ title, body })).catch(err => {
            console.error("❌ Misslyckades att skicka notis:", err);
        });
    });
}
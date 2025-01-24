"use server";
import webpush from "web-push";
import {createAdminClient} from "@/utils/supabase/server";

webpush.setVapidDetails(
    process.env.NEXT_PUBLIC_VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export const sendNotification = async (title: string, body: string) => {
    const supabase = createAdminClient();
    const payload = JSON.stringify({title, body});

    // Hämta alla prenumerationer
    const {data: subscriptions, error} = await supabase
        .from("Push_subscriptions")
        .select("subscription");

    if (error) throw new Error(`Fel vid hämtning av prenumerationer: ${error.message}`);

    let failedSubscriptions: any[] = [];

    const sendResults = await Promise.allSettled(
        subscriptions.map(async ({subscription}) => {
            try {
                const parsedSubscription =
                    typeof subscription === "string" ? JSON.parse(subscription) : subscription;

                await webpush.sendNotification(parsedSubscription, payload);
            } catch (err) {
                console.error("❌ Misslyckades att skicka notis:", err);
                failedSubscriptions.push(subscription);
            }
        })
    );

    console.log("🔔 Skickade notiser, resultat:", sendResults);

    return {success: true, sentTo: subscriptions.length, failed: failedSubscriptions.length};
};

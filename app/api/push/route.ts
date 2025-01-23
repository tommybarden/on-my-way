import { createAdminClient, createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import webpush from "web-push";

export async function GET(request: Request) {

    const supabase = createAdminClient()

    const messages = [
        { title: "J15 startar", body: "5 kvitterade" },
        { title: "Backade", body: "" },
        { title: "Nytt larm", body: "Räddning - Assistans" },
    ];

    const payload = JSON.stringify(messages[Math.floor(Math.random() * messages.length)]);


    webpush.setVapidDetails(
        process.env.NEXT_PUBLIC_VAPID_SUBJECT!,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
    );

    console.log("VAPID_SUBJECT:", process.env.NEXT_PUBLIC_VAPID_SUBJECT);
    console.log("VAPID_PUBLIC:", process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
    console.log("VAPID_PRIVATE:", process.env.VAPID_PRIVATE_KEY);

    const { data: subscriptions, error } = await supabase.from("Push_subscriptions").select("subscription");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    subscriptions?.forEach(({ subscription }) => {

        subscription = JSON.parse(subscription)

        webpush.sendNotification(subscription, payload).catch(err => {
            console.error("❌ Misslyckades att skicka notis:", err);
        });
    });

    return NextResponse.json({ message: "Push-notiser skickade!" }, { status: 200 });
}
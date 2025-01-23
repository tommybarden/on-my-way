import { createAdminClient, createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import webpush from "web-push";

export async function POST(request: Request) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) { //  process.env.PUSH_SECRET_KEY
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const supabase = createAdminClient()

    const { title, body } = await request.json();
    const payload = JSON.stringify({ title, body });

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
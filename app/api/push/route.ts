import {createAdminClient} from "@/utils/supabase/server";
import {NextResponse} from "next/server";
import webpush from "web-push";

export async function GET(request: Request) {

    const supabase = createAdminClient()

    const messages = [
        {title: "J15 startar", body: "5 kvitterade"},
        {title: "Backade", body: ""},
        {title: "Nytt larm", body: "Räddning - Assistans"},
    ];

    const payload = JSON.stringify(messages[Math.floor(Math.random() * messages.length)]);

    try {
        webpush.setVapidDetails(
            process.env.NEXT_PUBLIC_VAPID_SUBJECT!,
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
            process.env.VAPID_PRIVATE_KEY!
        );
    } catch (err) {
        console.error("❌ Fel i VAPID-konfigurationen:", err);
        return NextResponse.json({error: "Fel i VAPID-konfigurationen"}, {status: 500});
    }

    const {data: subscriptions, error} = await supabase
        .from("Push_subscriptions")
        .select("subscription");

    if (error) return NextResponse.json({error: error.message}, {status: 500});

    console.log(`🔔 Skickar notiser till ${subscriptions.length} enheter`);

    const sendResults = await Promise.allSettled(
        subscriptions.map(async ({subscription}) => {
            try {
                const parsedSubscription = typeof subscription === "string"
                    ? JSON.parse(subscription)
                    : subscription;

                await webpush.sendNotification(parsedSubscription, payload);
            } catch (err) {
                console.error("❌ Misslyckades att skicka notis:", err);
            }
        })
    );

    console.log("🔔 Skickade notiser, resultat:", sendResults);

    return NextResponse.json({message: "Push-notiser skickade!"}, {status: 200});
}
import {NextResponse} from "next/server";
import webpush from "web-push";
import {createClient} from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.PUSH_SECRET_KEY) {
        return NextResponse.json({error: "Unauthorized"}, {status: 403});
    }

    const {title, body, url} = await req.json();

    webpush.setVapidDetails(
        "mailto:your@email.com",
        process.env.VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
    );

    const {data: subscriptions, error} = await supabase.from("push_subscriptions").select("subscription");
    if (error) return NextResponse.json({error: error.message}, {status: 500});

    subscriptions?.forEach(({subscription}) => {
        webpush.sendNotification(subscription, JSON.stringify({title, body, url})).catch(err => {
            console.error("❌ Misslyckades att skicka notis:", err);
        });
    });

    return NextResponse.json({message: "Push-notiser skickade!"}, {status: 200});
}

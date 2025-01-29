import {NextResponse} from "next/server";
import {sendNotification} from "@/services/notifications";

export async function GET(request: Request) {
    const messages = [
        {title: "J15 startar inte", body: "5 testare kvitterade"},
        {title: "Absolut inte backade", body: "Testar bara"},
        {title: "Absolut inte ett nytt larm", body: "Testar bara push"},
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    try {
        const result = await sendNotification(randomMessage.title, randomMessage.body);
        return NextResponse.json({message: "Push-notiser skickade!", result}, {status: 200});
    } catch (err) {
        console.error("❌ Fel vid skickning av notiser:", err);
        return NextResponse.json({error: "Misslyckades att skicka notiser"}, {status: 500});
    }
}

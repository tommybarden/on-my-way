import {NextResponse} from "next/server";
import {sendNotification} from "@/services/notifications";

export async function POST(request: Request) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
        return NextResponse.json({error: "Unauthorized"}, {status: 403});
    }

    try {
        const {title, body} = await request.json();
        const result = await sendNotification(title, body);
        return NextResponse.json({message: "Push-notiser skickade!", result}, {status: 200});
    } catch (err) {
        console.error("❌ Fel vid skickning av notiser:", err);
        return NextResponse.json({error: "Misslyckades att skicka notiser"}, {status: 500});
    }
}

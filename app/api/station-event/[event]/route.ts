import {NextResponse} from "next/server";
import {sendNotification} from "@/services/notifications";

export async function GET(request: Request, {params}: { params: Promise<{ event: string }> }) {
    const event = (await params).event

    if (!event) {
        return NextResponse.json({error: "Unauthorized"}, {status: 406});
    }

    try {
        const result = await sendNotification(event, 'TEST');
        return NextResponse.json({message: "Push-notiser skickade!", result}, {status: 200});
    } catch (err) {
        console.error("❌ Fel vid skickning av notiser:", err);
        return NextResponse.json({error: "Misslyckades att skicka notiser"}, {status: 500});
    }
}

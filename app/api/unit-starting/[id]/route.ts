import {NextResponse} from "next/server";
import {sendNotification} from "@/services/notifications";

export async function GET(request: Request, {params}: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const idRegex = /^[A-Za-z]{1,3}\d{2,3}$/;

    if (!idRegex.test(id)) {
        return NextResponse.json({error: "Unauthorized"}, {status: 406});
    }

    try {
        const result = await sendNotification(id + ' startar', 'TEST');
        return NextResponse.json({message: "Push-notiser skickade!", result}, {status: 200});
    } catch (err) {
        console.error("❌ Fel vid skickning av notiser:", err);
        return NextResponse.json({error: "Misslyckades att skicka notiser"}, {status: 500});
    }
}

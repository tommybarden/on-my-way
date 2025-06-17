import { sendNotification } from "@/services/server/notifications";
import { NextResponse } from "next/server";
import { writeToLog } from "@/services/server/log";
import { upsertAlarm } from "@/services/server/alarms";

export async function POST(request: Request) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || process.env.API_KEY !== apiKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { sms, unit } = await request.json()

        if (!sms) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
        }

        const alarmResult = await upsertAlarm({});
        if (!alarmResult) throw new Error("Failed to create alarm");

        await writeToLog('SMS recieved from ' + unit, JSON.stringify(sms))

        try {
            const result = await sendNotification('Nytt larm!', 'Ålarm-backup');
            return NextResponse.json({ message: "Push-notiser skickade!", result }, { status: 200 });
        } catch (err) {
            console.error("❌ Fel vid skickning av notiser:", err);
            return NextResponse.json({ error: "Misslyckades att skicka notiser" }, { status: 500 });
        }

    } catch (e) {
        console.error("Error handling event:", e);
        return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
    }
}

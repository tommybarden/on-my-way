import { cancelAlarm, endAlarm, upsertAlarm } from "@/services/server/alarms";
import { writeToLog } from "@/services/server/log";
import { sendNotification } from "@/services/server/notifications";
import { getCurrentUser } from "@/services/server/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ event: string }> }) {
    const event = (await params).event

    const searchParams = request.nextUrl.searchParams;
    let secret = searchParams.get('secret');

    const user = await getCurrentUser()

    if (user) { //Override API key if logged in
        await writeToLog('user-event', event)
        secret = process.env.API_KEY ?? ''
    }

    if (!event || process.env.API_KEY !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 406 });
    }

    try {
        switch (event) {
            case 'alarm':
                console.log('Alarm')
                await sendNotification('Nytt larm!');
                const alarmResult = await upsertAlarm({});
                if (!alarmResult) throw new Error("Failed to create alarm");
                break;

            case 'abort':
                console.log('Backade')
                await sendNotification('Backade!');
                const cancelResult = await cancelAlarm();
                if (!cancelResult) throw new Error("Failed to cancel alarm");
                break;

            case 'all-off':
                console.log('All-off')
                //const offResult = await endAlarm();
                //if (!offResult) throw new Error("Failed to send all-off");
                break;

            case 'alarm-off':
                console.log('Alarm-off')
                await sendNotification('Insatsen avslutad. Återgå i beredskap.');
                const endResult = await endAlarm();
                if (!endResult) throw new Error("Failed to end alarm");
                break;

            case 'active':
                console.log('Närvaro')
                break;

            default:
                return NextResponse.json({ error: "Invalid event" }, { status: 400 });
        }

        //Put event in log, from where we handle display state
        await writeToLog('station-event', event)

        return NextResponse.json({ message: "OK" }, { status: 200 });
    } catch (e) {
        console.error("Error handling event:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

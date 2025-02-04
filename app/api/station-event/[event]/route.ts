import {cancelAlarm, createAlarm, endAlarm} from "@/services/server/alarms";
import {writeToLog} from "@/services/server/log";
import {sendNotification} from "@/services/server/notifications";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest, {params}: { params: Promise<{ event: string }> }) {
    const event = (await params).event

    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');

    if (!event || process.env.API_KEY !== secret) {
        return NextResponse.json({error: "Unauthorized"}, {status: 406});
    }

    try {
        switch (event) {
            case 'alarm':
                console.log('Alarm')
                await sendNotification('Nytt larm!');
                const units = process.env.DEFAULT_UNITS || 'J11, J12, J14, J15, J17';
                const alarmResult = await createAlarm('VIRVE', 'Plats saknas', units);
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
                const endResult = await endAlarm();
                if (!endResult) throw new Error("Failed to end alarm");
                // TODO: Släck skärmen
                break;

            case 'active':
                console.log('Närvaro')
                // TODO: Tänd skärmen för övningsläge
                break;

            default:
                return NextResponse.json({error: "Invalid event"}, {status: 400});
        }

        await writeToLog('station-event', event)

        return NextResponse.json({message: "OK"}, {status: 200});
    } catch (e) {
        console.error("Error handling event:", e);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

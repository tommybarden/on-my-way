import {NextResponse} from "next/server";
import {getLatestAlarm} from "@/services/server/alarms";
import {getAllUsers, getCurrentUser} from "@/services/server/users";
import {getConfirmed} from "@/services/client/alarms";
import {getStartedUnits} from "@/services/client/units";

export async function GET() {

    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({error: 'Forbidden'}, {status: 403})
    }

    const latest_alarm = await getLatestAlarm();
    if (!latest_alarm) {
        return NextResponse.json({error: "No alarm found"}, {status: 500});
    }

    const users = await getAllUsers();
    const confirmed = await getConfirmed(latest_alarm.id);
    const units = (await getStartedUnits(latest_alarm.id)).map(unit => ({
        unit: unit.unit,
        left: new Date(unit.created_at)
    }));

    const data = {
        users,
        confirmed,
        units
    }

    const res = NextResponse.json({data}, {status: 200});
    res.headers.set('Access-Control-Allow-Origin', 'https://raddning.ax')

    return res
}

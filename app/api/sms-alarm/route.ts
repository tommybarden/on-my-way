import {NextResponse} from 'next/server';
import {writeToLog} from "@/services/server/log";
import {getLatestAlarm, updateAlarm} from "@/services/server/alarms";

export async function POST(request: Request) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || process.env.API_KEY !== apiKey) {
        return NextResponse.json({error: "Unauthorized"}, {status: 403});
    }

    try {
        const {sms, unit} = await request.json()

        if (!sms) {
            return NextResponse.json({error: "Unauthorized"}, {status: 400});
        }

        //const geoRegex = /^(?<geo>N\s\d{2}[?,#]\d{1,3}\.\d{1,4}\sE\s\d{2}[?,#]\d{1,3}\.\d{1,3})$/;
        //const infoRegex = /^(?<location>.+)[;,\/]\s*(?<description>Klass:[^;]+);\s+(?<units>[A-Z]{1,3}[0-9]{2,3}.*)$/;
        const infoRegex = /^(?<location>.+)[;,\/]\s*(?<description>(Klass:|Typ av förstärkning)[^;]+);\s+(?<units>[A-Za-z]{1,3}[0-9]{2,3}.*)$/;
        const geoRegex = /^N\s(?<lat>\d{2}[#?]\d{1,2}\.\d{1,3})\sE\s(?<lon>\d{2}[#?]\d{1,2}\.\d{1,3})$/;

        const geo = sms.match(geoRegex);
        const info = sms.match(infoRegex);

        let alarm: { [key: string]: string } = {
            geo: "",
            location: "",
            description: "",
            units: "",
        };

        if (geo && geo?.groups) {
            const {lat, lon} = geo?.groups;

            alarm.geo = [lat, lon].map(str => {
                const [degrees, minutes] = str.replace("?", "#").split("#");
                return parseInt(degrees) + (parseFloat(minutes) / 60);
            }).join(" ")
        }

        if (info && info?.groups) {
            alarm.location = info.groups.location ?? ""
            alarm.description = info.groups.description ?? ""
            alarm.units = info.groups.units ?? ""
        }

        console.log(alarm)

        if (!geo && !info) {
            await writeToLog('Could not parse SMS', sms)
            return NextResponse.json({error: "Could not parse SMS", sms}, {status: 424});
        }

        alarm = Object.fromEntries(
            Object.entries(alarm).map(([key, value]: [string, string]) => [key, value.trim()])
        );

        await writeToLog('SMS recieved from ' + unit, JSON.stringify(alarm))

        try {
            const latestAlarm = await getLatestAlarm()
            await writeToLog('Latest alarm', JSON.stringify(latestAlarm));

            const currentAlarm = await updateAlarm(alarm);
            await writeToLog('Alarm updated', JSON.stringify(currentAlarm));
        } catch (error) {
            console.error("Error updating alarm:", error);
            await writeToLog('Error updating alarm', JSON.stringify(error));
            return NextResponse.json({error: "Failed to update alarm"}, {status: 500});
        }

        return NextResponse.json({message: "OK", alarm}, {status: 200});

    } catch (e) {
        console.error("Error handling event:", e);
        return NextResponse.json({error: e instanceof Error ? e.message : "Unknown error"}, {status: 500});
    }
}
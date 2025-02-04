import {NextResponse} from "next/server";
import {writeToLog} from "@/services/server/log";

export async function POST(request: Request) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || process.env.API_KEY !== apiKey) {
        return NextResponse.json({error: "Unauthorized"}, {status: 403});
    }

    const {sms, unit} = await request.json()

    const regex = /^(?<geo>N\s\d{2}[?,#]\d{1,3}\.\d{1,4}\sE\s\d{2}[?,#]\d{1,3}\.\d{1,3})?;?(?<location>.+)[;,\/]\s*(?<description>Klass:[^;]+);\s+(?<units>[A-Z]{1,3}[0-9]{2,3}.*)$/;
    const matches = sms ? sms.match(regex) : null;
    let alarm: { [key: string]: string } = {
        geo: "",
        location: "",
        description: sms ?? "",
        units: "J11, J12, J14, J15, J17, J18",
    };

    if (matches && matches?.groups) {
        alarm = {
            geo: matches.groups.geo || "",
            location: matches.groups.location || "Okänd adress",
            description: matches.groups.description || "Beskrivning saknas",
            units: matches.groups.units || "",
        }
    } else {
        await writeToLog('Could not parse SMS', sms ?? '')
        // TODO: Skapa ett larm med "sms" som beskrivning ifall det går snett
        return NextResponse.json({error: "Could not parse SMS", sms}, {status: 424});
    }

    alarm = Object.fromEntries(
        Object.entries(alarm).map(([key, value]: [string, string]) => [key, value.trim()])
    );

    // TODO: Kolla i databasen om det finns ett larm aktivt. Ifall aktivt larm finnes, uppdatera. Om ej, skapa ett
    await writeToLog('SMS recieved from ' + unit, JSON.stringify(alarm))

    return NextResponse.json({message: "OK", alarm, unit}, {status: 200});
}
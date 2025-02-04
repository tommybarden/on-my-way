import {NextResponse} from "next/server";
import {writeToLog} from "@/services/server/log";

export async function POST(request: Request) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || process.env.API_KEY !== apiKey) {
        return NextResponse.json({error: "Unauthorized", apiKey}, {status: 403});
    }

    const {sms, unit} = await request.json()

    await writeToLog('SMS recieved from ' + unit, sms)

    const regex = /^(N\s\d{2}[?,#]\d{1,3}\.\d{1,4}\sE\s\d{2}[?,#]\d{1,3}\.\d{1,3})?;?(.+)[;,\/]\s*(Klass:[^;]+);\s+([A-Z]{1,3}[0-9]{2,3}.*)$/;
    const matches = sms.match(regex);
    let alarm: { [key: string]: string } = {
        geo: "",
        location: "",
        description: "",
        units: "",
    };

    if (matches) {
        alarm = {
            geo: matches[1] || "",
            location: matches[2] || "Okänd adress",
            description: matches[3] || "Beskrivning saknas",
            units: matches[4] || "",
        }
    }

    alarm = Object.fromEntries(
        Object.entries(alarm).map(([key, value]: [string, string]) => [key, value.trim()])
    );

    return NextResponse.json({message: "OK", alarm, unit, json: JSON.stringify(alarm)}, {status: 200});
}
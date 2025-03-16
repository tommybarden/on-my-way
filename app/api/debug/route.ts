import { after, NextResponse } from 'next/server';
import { writeToLog } from "@/services/server/log";

export async function POST(request: Request) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || process.env.API_KEY !== apiKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        await writeToLog('Debug', 'Start ' + Date.now())

        after(async () => {
            const postpone = Math.floor(Math.random() * 500) + 2000;
            await new Promise(resolve => setTimeout(resolve, postpone));

            await writeToLog('Debug', 'End ' + Date.now() + ' ' + postpone);
        });

        return NextResponse.json({ message: "OK" }, { status: 200 });

    } catch (e) {
        console.error("Error handling event:", e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
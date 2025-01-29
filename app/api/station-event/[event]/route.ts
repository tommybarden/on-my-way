import { NextRequest, NextResponse } from "next/server";
//import {sendNotification} from "@/services/notifications";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ event: string }> }) {
    const event = (await params).event

    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret')

    if (!event || process.env.API_KEY !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 406 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('Log')
        .insert([
            { category: 'station-event', message: event },
        ])
        .select()

    return NextResponse.json({ message: "OK", data }, { status: 200 });

    // try {
    //     const result = await sendNotification(event, 'TEST');
    //     return NextResponse.json({message: "Push-notiser skickade!", result}, {status: 200});
    // } catch (err) {
    //     console.error("❌ Fel vid skickning av notiser:", err);
    //     return NextResponse.json({error: "Misslyckades att skicka notiser"}, {status: 500});
    // }
}

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


    switch (event) {
        case 'alarm': console.log('Alarm') //Skapa ny rad i alarm-tabellen
            break;

        case 'abort': console.log('Backade') //Skicka notis att vi är backade. Ev. byt status på nuvarande larm
            break;

        case 'all-off': console.log('All-off') //Byt status på aktivt larm
            break;

        case 'active': console.log('Närvaro') //Tänd skärmen för övningsläge
            break;

        default:
            return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "OK", data }, { status: 200 });
}

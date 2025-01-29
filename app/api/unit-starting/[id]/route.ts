import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
//import {sendNotification} from "@/services/notifications";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    const idRegex = /^[A-Za-z]{1,3}\d{2,3}$/;

    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret')

    if (!idRegex.test(id) || process.env.API_KEY !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 406 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('Log')
        .insert([
            { category: 'unit-starting', message: id },
        ])
        .select()

    return NextResponse.json({ message: "OK", data }, { status: 200 });

    // try {
    //     const result = await sendNotification(id + ' startar', 'TEST');
    //     return NextResponse.json({message: "Push-notiser skickade!", result}, {status: 200});
    // } catch (err) {
    //     console.error("❌ Fel vid skickning av notiser:", err);
    //     return NextResponse.json({error: "Misslyckades att skicka notiser"}, {status: 500});
    // }
}

import { sendNotification } from "@/services/notifications";
import { unitStarting } from "@/services/units";
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

    const data = await unitStarting(id);

    if (!data) {
        return NextResponse.json({ error: "Could not save" }, { status: 406 });
    }

    await sendNotification(id + ' startar', 'TEST');
    return NextResponse.json({ message: "OK", data }, { status: 200 });
}

import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
    const {userId, subscription} = await req.json();

    const {error} = await supabase.from("push_subscriptions").upsert({
        user_id: userId,
        subscription: subscription
    });

    if (error) return NextResponse.json({error: error.message}, {status: 500});

    return NextResponse.json({message: "Push-subscription sparad!"}, {status: 200});
}

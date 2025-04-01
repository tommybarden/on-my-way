import { sendNotification } from "@/services/server/notifications";
import { NextResponse } from "next/server";

export async function GET() {
    const messages = [
        { title: "TEST", body: "Testar bara" },
        { title: "Ett test", body: "Testar bara" },
        { title: "Testing testing!", body: "Testar bara push" },
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    try {
        const result = await sendNotification(randomMessage.title, randomMessage.body);
        return NextResponse.json({ message: "Push-notiser skickade!", result }, { status: 200 });
    } catch (err) {
        console.error("❌ Fel vid skickning av notiser:", err);
        return NextResponse.json({ error: "Misslyckades att skicka notiser" }, { status: 500 });
    }
}

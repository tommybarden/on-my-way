import {createClient} from "@/utils/supabase/server";
import OngoingAlarm from "@/components/alarms/ongoing-alarm";
import {Button} from "@/components/ui/button";

export default async function ProtectedPage() {

    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    return (
        <div className="flex-1 w-full flex flex-col gap-2">

            <p className="hidden">Inloggad som {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</p>

            <OngoingAlarm className="rounded-md border-accent border-2"/>

            <div className="flex w-full flex-col gap-4">
                <p className="text-2xl">Kvittera</p>
                <Button type="button" variant={"outline"} size={"lg"}>Räknar...</Button>
                <Button type="button" variant={"destructive"} size={"lg"}><p className="text-2xl">5 min</p></Button>
                <Button type="button" variant={"destructive"} size={"lg"}><p className="text-2xl">10 min</p></Button>
                <Button type="button" variant={"destructive"} size={"lg"}><p className="text-2xl">15 min</p></Button>
                <Button type="button" variant={"secondary"} size={"lg"}><p className="text-2xl">Far direkt</p></Button>
            </div>
        </div>
    );
}

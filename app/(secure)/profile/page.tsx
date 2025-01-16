import {createClient} from "@/utils/supabase/server";
import OngoingAlarm from "@/components/alarms/ongoing-alarm";
import ConfirmButtons from "@/components/confirm-buttons";

export default async function ProtectedPage() {

    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    return (
        <div className="flex-1 w-full flex flex-col gap-2">

            <p className="hidden">Inloggad som {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</p>

            <OngoingAlarm className="rounded-md border-accent border-2"/>

            <ConfirmButtons/>

        </div>
    );
}

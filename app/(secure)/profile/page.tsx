import OngoingAlarm from "@/components/alarms/ongoing-alarm";
import ConfirmButtons from "@/components/confirm-buttons";
import { getOngoingAlarm } from "@/services/alarms";

export default async function ProtectedPage() {

    const current_alarm = await getOngoingAlarm()

    return (
        <div className="flex-1 w-full flex flex-col gap-2">

            <OngoingAlarm className="rounded-md border-accent border-2"/>
            <ConfirmButtons alarmId={current_alarm?.id} className="rounded-md border-accent border-2"/>

        </div>
    );
}

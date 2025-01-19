import AlarmListener from "@/components/alarms/alarm-listener";
import OngoingAlarm from "@/components/alarms/ongoing-alarm";
import ConfirmButtons from "@/components/confirms/confirm-buttons";
import ConfirmedList from "@/components/confirms/confirmed-list";
import { getOngoingAlarm } from "@/services/alarms";
import { getAllUsers, getCurrentUser } from "@/services/users";

export default async function ProtectedPage() {

    const current_alarm = await getOngoingAlarm();
    
    if(!current_alarm) {
        return (
            <div>
                <div>Inget pågående larm...</div>
                <AlarmListener/>                
            </div>

        )
    }

    const user = await getCurrentUser();
    const users = await getAllUsers();

    return (
        <div className="flex-1 w-full flex flex-col gap-2">

            <AlarmListener/>  
            <OngoingAlarm className="rounded-md border-accent border-2"/>
            <ConfirmButtons user={user ?? {}} alarmId={current_alarm?.id} className="rounded-md border-accent border-2"/>
            <ConfirmedList users={users ?? {}} alarmId={current_alarm?.id ?? 0} className="rounded-md border-accent border-2"/>

        </div>
    );
}

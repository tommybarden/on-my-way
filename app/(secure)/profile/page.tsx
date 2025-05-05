import AlarmCanceled from "@/components/alarms/alarm-canceled";
import AlarmListener from "@/components/alarms/alarm-listener";
import OngoingAlarm from "@/components/alarms/ongoing-alarm";
import ConfirmButtons from "@/components/confirms/confirm-buttons";
import ConfirmedList from "@/components/confirms/confirmed-list";
import StartedUnitsList from "@/components/confirms/started-units";
import {getOngoingAlarm} from "@/services/client/alarms";
import {getAllUsers, getCurrentUser} from "@/services/server/users";
import {FireExtinguisher} from "lucide-react";

export default async function ProfilePage() {

    const current_alarm = await getOngoingAlarm();

    if (!current_alarm) {
        return (
            <div className="flex flex-col justify-center items-center gap-4 h-64">
                <FireExtinguisher size={100} strokeWidth={1}/>
                <div>Inget pågående larm</div>
                <AlarmListener/>
            </div>
        )
    }

    const user = await getCurrentUser();
    const users = await getAllUsers();

    if (!user) {
        return "Ett fel uppstod. Starta om appen."
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-2">

            <AlarmListener/>
            <AlarmCanceled className="rounded-md border-accent border-2"/>
            <OngoingAlarm className="rounded-md border-accent border-2"/>
            <ConfirmButtons userId={user?.id ?? ""} alarmId={current_alarm?.id}
                            className="rounded-md border-accent border-2"/>
            <StartedUnitsList alarmId={current_alarm?.id ?? 0} className="rounded-md border-accent border-2"/>
            <ConfirmedList users={users ?? []} alarmId={current_alarm?.id ?? 0}
                           className="rounded-md border-accent border-2"/>

        </div>
    );
}

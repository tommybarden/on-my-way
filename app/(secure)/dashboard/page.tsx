import OngoingAlarm from "@/components/alarms/ongoing-alarm";
import AlarmList from "@/components/alarms/alarm-list";
import AlarmListener from "@/components/alarms/alarm-listener";
import ConfirmedList from "@/components/confirms/confirmed-list";
import AlarmMap from "@/components/alarms/alarm-map";
import { getOngoingAlarm } from "@/services/client/alarms";
import { getAllUsers } from "@/services/server/users";

export default async function DashboardPage() {

    const current_alarm = await getOngoingAlarm();

    if (!current_alarm) {
        return (
            <div>
                <AlarmList />
                <AlarmListener />
            </div>
        )
    }

    const users = await getAllUsers();

    return (
        <>
            <AlarmListener />
            <div>
                <AlarmMap />
                <OngoingAlarm className="rounded-md border-accent border-2 max-w-7xl" />
            </div>
            <div>
                <ConfirmedList users={users ?? []} alarmId={current_alarm?.id ?? 0} className="rounded-md border-accent border-2 min-w-md" />
            </div>
        </>

    );
}
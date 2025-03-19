import OngoingAlarm from "@/components/alarms/ongoing-alarm";
import AlarmList from "@/components/alarms/alarm-list";
import AlarmListener from "@/components/alarms/alarm-listener";
import ConfirmedList from "@/components/confirms/confirmed-list";
import AlarmMap from "@/components/alarms/alarm-map";
import {getOngoingAlarm} from "@/services/client/alarms";
import {getAllUsers} from "@/services/server/users";
import StartedUnitsList from "@/components/confirms/started-units";
import ScreenSaver from "@/components/default/dashboard-screensaver";
import AlarmCanceled from "@/components/alarms/alarm-canceled";
import UsersList from "@/components/default/all-users";

export const revalidate = 0

export default async function DashboardPage() {

    const current_alarm = await getOngoingAlarm();
    const users = await getAllUsers();

    if (!current_alarm) {
        return (
            <>
                <ScreenSaver/>
                <AlarmListener/>
                <div className="flex flex-grow gap-6 justify-around">
                    <div className="basis-1/4">
                        <AlarmList/>
                    </div>
                    <div className="basis-2/4">
                        <UsersList users={users ?? []}/>
                    </div>
                </div>


            </>
        )
    }

    return (
        <>
            <AlarmListener/>
            <div className="basis-3/5">
                <AlarmMap geo={current_alarm?.geo ?? ''} className="min-h-[60rem] h-[60vh]"/>
                <OngoingAlarm className="rounded-md border-accent border-2 w-full"/>
            </div>
            <div className="basis-2/5">
                <AlarmCanceled className="rounded-md border-accent border-2 mb-4 text-4xl p-10 h-20"/>
                <StartedUnitsList
                    alarmId={current_alarm?.id ?? 0}
                    className="rounded-md border-accent border-2 mb-4"
                />
                <ConfirmedList
                    users={users ?? []} alarmId={current_alarm?.id ?? 0}
                    className="rounded-md border-accent border-2 min-w-md"
                />
            </div>
        </>

    );
}
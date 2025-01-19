import OngoingAlarm from "@/components/alarms/ongoing-alarm";
import AlarmList from "@/components/alarms/alarm-list";

export default async function DashboardPage() {

    return (
        <div className="flex-1 w-full flex flex-col gap-12">

            <OngoingAlarm className="rounded-md border-accent border-2"/>
            <AlarmList/>

        </div>
    );
}
import AlarmDetails from "@/components/alarms/alarm-details";
import AlarmListener from "@/components/alarms/alarm-listener";
import EndAlarmButton from "@/components/alarms/end-alarm-button";
import { getAlarmById, getLatestAlarm } from "@/services/server/alarms";
import { Info, MapPin } from "lucide-react";

export default async function AlarmPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const latest_alarm = await getLatestAlarm();

    if (latest_alarm && 2 !== latest_alarm.status) {
        return (
            <>
                <AlarmListener />
                <div className="text-3xl">Pågående larm</div>
                <div className="flex flex-col gap-4 my-8">
                    <div className="flex flex-row gap-2"><MapPin strokeWidth={1} color="#ff0000" /> {latest_alarm.location}</div>
                    <div className="flex flex-row gap-2"><Info strokeWidth={1} color="#ff0000" /> {latest_alarm.description}</div>

                    <EndAlarmButton />
                </div>
            </>
        )
    }

    const alarm = id ? await getAlarmById(id) : latest_alarm;

    return (
        <>
            <AlarmListener />
            <div className="flex-1 w-full flex flex-col gap-2">
                <div className="text-xl">Tidigare larm</div>
                {alarm &&
                    <AlarmDetails alarm={alarm} className="my-4" />
                }
            </div>
        </>

    )
}
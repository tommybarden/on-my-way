import AlarmDetails from "@/components/alarms/alarm-details";
import AlarmListener from "@/components/alarms/alarm-listener";
import EndAlarmButton from "@/components/alarms/end-alarm-button";
import {getAlarmById, getFinishedAlarms, getLatestAlarm} from "@/services/server/alarms";
import {prettyDate} from "@/utils/helpers";
import {ChevronLeft, Info, MapPin} from "lucide-react";
import Link from "next/link";

export default async function AlarmPage({params}: { params: Promise<{ id: string }> }) {

    const {id} = await params;
    const latest_alarm = await getLatestAlarm();

    if (latest_alarm && 2 !== latest_alarm.status) {
        return (
            <>
                <AlarmListener/>
                <div className="text-3xl">Pågående larm</div>
                <div className="flex flex-col gap-4 my-8">
                    <div className="flex flex-row gap-2"><MapPin strokeWidth={1}
                                                                 color="#ff0000"/> {latest_alarm.location}</div>
                    <div className="flex flex-row gap-2"><Info strokeWidth={1}
                                                               color="#ff0000"/> {latest_alarm.description}</div>

                    <EndAlarmButton/>
                </div>
            </>
        )
    }

    const alarm = id ? await getAlarmById(id) : latest_alarm;
    const archive = await getFinishedAlarms()

    return (
        <>
            <AlarmListener/>
            <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
                {alarm &&
                    <AlarmDetails alarm={alarm} className="md:w-1/2 border p-4"/>
                }
                {archive &&
                    <div className="md:w-1/2  border p-4">
                        <div className="text-xl">Tidigare larm</div>
                        <ul role="list" className="divide-y divide-gray-100 py-6">
                            {archive.map((alarm) => (
                                <li key={alarm.id}
                                    className={'flex justify-between gap-x-6 hover:text-red-700' + ((id ?? latest_alarm.id) == alarm.id ? 'font-bold text-red-800' : '')}>
                                    <Link href={`/larm/${alarm.id}`}
                                          className="flex w-full justify-between gap-x-6 py-5">
                                        <div className="flex flex-row gap-2">
                                            <div><ChevronLeft/></div>
                                            <div className="max-w-64 truncate">{alarm.location}</div>
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <div>{prettyDate(alarm.created_at, {date: true})}</div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                }
            </div>
        </>

    )
}
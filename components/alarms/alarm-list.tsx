import {getFinishedAlarms} from "@/services/server/alarms";
import {prettyDate} from "@/utils/helpers";

export default async function AlarmList() {

    const alarms = await getFinishedAlarms()

    if (!alarms) {
        return false
    }

    return (
        <div>
            <div className="lg:text-5xl xl:text-6xl text-center pb-4">Senaste larm</div>

            <ul className="divide-y divide-gray-200 space-y-8 lg:text-2xl xl:text-3xl" role="list">
                {alarms.slice(0, 8).map((alarm) => (
                    <li key={alarm.id} className="flex items-center justify-between py-8 pb-2">

                        <div className="min-w-0 flex-1">
                            <p className="font-semibold lg:text-4xl xl:text-5xl mb-4">{alarm.location}</p>
                            <p className="truncate font-light">{alarm.description.split('.').slice(0, 2).join('.')}</p>
                        </div>

                        <div className="shrink-0 text-right">
                            <p>{prettyDate(alarm.created_at ?? '', {date: true})}</p>
                            <p>{prettyDate(alarm.created_at ?? '', {time: true})}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    )
}
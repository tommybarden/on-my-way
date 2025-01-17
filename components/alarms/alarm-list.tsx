import {prettyDate} from "@/utils/helpers";
import {createClient} from "@/utils/supabase/server";
import { Alarm } from "@/utils/types";

export default async function AlarmList() {

    const supabase = await createClient();

    let {data: alarms, error} = await supabase
        .from<string, Alarm>('Alarms')
        .select('*')
        .eq('status', 2)
        .limit(10)

    if (!alarms) {
        return false
    }

    return (
        <ul className="divide-y divide-gray-100" role="list">
            {alarms.map((alarm, i) =>
                <li className={'flex justify-between gap-x-6 py-5 alarm-' + i} key={alarm.id}>
                    <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                            <p className="font-semibold">{alarm.location}</p>
                            <p className="truncate">{alarm.description.split('.').slice(0, 2).join('.')}</p>
                        </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <p className="">{prettyDate(alarm.created_at, {date: true})}</p>
                        <p className="">{prettyDate(alarm.created_at, {time: true})}</p>
                    </div>
                </li>
            )}
        </ul>
    )
}
import { getOngoingAlarm } from "@/services/alarms";
import { filterUnits, prettyDate } from "@/utils/helpers";

export default async function OngoingAlarm(props: any) {

    const current_alarm = await getOngoingAlarm();

    return current_alarm && (
        <div className={props.className + ' p-4'}>
            <div className="flex justify-between mb-6">
                <div>
                    <strong>Aktuellt larm</strong>
                </div>
                <div>
                    <span>{prettyDate(current_alarm.created_at, { time: true })}</span>
                </div>
            </div>
          
          <p className="text-2xl">{current_alarm.location}</p>
          <p className="my-6">{current_alarm.description}</p>
          <p className="text-xl mb-3">Egna enheter: {filterUnits(current_alarm.units, true)}</p>
          <p>Andra enheter: {filterUnits(current_alarm.units, false)}</p>
        </div>
      );
}
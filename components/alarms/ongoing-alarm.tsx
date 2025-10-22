import { getOngoingAlarm } from "@/services/client/alarms";
import { filterUnits, prettyDate } from "@/utils/helpers";

export default async function OngoingAlarm(props: { className?: string; }) {
    const { className } = props;
    const current_alarm = await getOngoingAlarm();

    return current_alarm && (
        <div className={className + ' p-4 lg:text-3xl xl:text-4xl'}>
            <div className="flex justify-between mb-6">
                <div>
                    <strong>Aktuellt larm</strong>
                </div>
                <div>
                    <span>{prettyDate(current_alarm.created_at, { time: true })}</span>
                </div>
            </div>

            <p className="text-2xl lg:text-6xl xl:text-8xl xl:mb-20">{current_alarm.location}</p>
            <p className="my-4">{current_alarm.description}</p>
            <p className="text-md lg:text-3xl xl:text-5xl mb-3">Egna enheter: {filterUnits(current_alarm.units, true)}</p>
            <p className="lg:mt-10 hidden">Andra enheter: {filterUnits(current_alarm.units, false)}</p>
        </div>
    );
}
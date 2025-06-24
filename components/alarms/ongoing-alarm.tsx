import {getOngoingAlarm} from "@/services/client/alarms";
import {prettyDate} from "@/utils/helpers";

export default async function OngoingAlarm(props: { className?: string; }) {
    const {className} = props;
    const current_alarm = await getOngoingAlarm();

    return current_alarm && (
        <div className={className + ' p-4 lg:text-3xl xl:text-4xl'}>
            <div className="flex justify-between mb-6">
                <div>
                    <strong>Aktuellt larm</strong>
                </div>
                <div>
                    <span>{prettyDate(current_alarm.created_at, {time: true})}</span>
                </div>
            </div>

            <p className="text-2xl lg:text-6xl xl:text-8xl xl:mb-20">{current_alarm.location}</p>
            <p className="my-6">{current_alarm.description}</p>
            <p className="text-xl lg:text-3xl xl:text-5xl mb-3">Enheter: {current_alarm.units}</p>
        </div>
    );
}
import {isCanceledAlarm} from "@/services/client/alarms";
import {OctagonAlert} from "lucide-react";

export default async function AlarmCanceled(props: { className?: string; }) {
    const {className} = props;
    const isCanceled = await isCanceledAlarm()

    if (isCanceled) {
        return (
            <div
                className={className + ' animate-pulse flex flex-1 w-full min-h-6 bg-popover justify-between items-center rounded-md p-4 py-8 gap-2'}>
                <OctagonAlert color="#ff0000" size="40"/>
                <span className="uppercase tracking-widest text-2xl">Backade</span>
                <OctagonAlert color="#ff0000" size="40"/>
            </div>
        )
    } else {
        return ""
    }
}

import { isCanceledAlarm } from "@/services/client/alarms";
import { OctagonAlert } from "lucide-react";

export default async function AlarmCanceled(props: { className?: string; }) {
    const { className } = props;
    const isCanceled = await isCanceledAlarm()

    if (isCanceled) {
        return (
            <div className={className + ' flex flex-1 w-full h-6 bg-popover justify-between items-center rounded-md p-4 gap-2'}>
                <OctagonAlert color="#ff0000" />
                <span className="uppercase tracking-widest">Backade</span>
                <span className="w-6"></span>
            </div>
        )
    } else {
        return ""
    }
}
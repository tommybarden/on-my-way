'use client'
import { removeSubscription, subscribeToUnitsStarting } from "@/services/client/subscriptions";
import { getStartedUnits } from "@/services/client/units";
import { calculateStartedUnits, formatTime } from "@/utils/helpers";
import { Unit } from "@/utils/types";
import { useEffect, useState } from "react";


export default function StartedUnitsList(props: { alarmId: number; className?: string; }) {
    const { alarmId, className } = props;
    const [units, setUnits] = useState<Unit[]>([]);

    useEffect(() => {
        if (!alarmId) return;

        const fetchUnits = async () => {
            const units = await getStartedUnits(alarmId)

            if (units) {
                const calculatedUnits = calculateStartedUnits(units)
                setUnits(calculatedUnits)
            }
        }

        fetchUnits()

        const subscription = subscribeToUnitsStarting(() => {
            fetchUnits();
        });

        const interval = setInterval(() => {
            setUnits(prevState => {
                if (!prevState) return prevState;
                return prevState.map(row => {
                    const updatedRow = { ...row };
                    updatedRow.timeSince = (updatedRow.timeSince ?? 0) + 1;
                    return updatedRow;
                });
            });
        }, 1000);

        // Clear after
        return () => {
            removeSubscription(subscription)
            clearInterval(interval)
        };

    }, [alarmId])

    if (!units || units.length < 1) {
        return ""
    }

    return (
        <div className={className + ' p-4 lg:text-3xl xl:text-4xl'}>
            <div className="flex w-full flex-col gap-5">
                <strong>Startade bilar</strong>
                <div className="flex flex-wrap justify-center gap-4">
                    {units.map((unit, i) =>
                        <div key={i} className="flex flex-col justify-center items-center gap-1">
                            <div className="text-2xl ring rounded-full p-5 px-4 tabular-nums">{unit.unit}</div>
                            <span className="" style={{ fontFamily: 'Courier New, monospace' }}>
                                {unit.timeSince && unit.timeSince < 900 ? formatTime(unit.timeSince) : "På väg"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
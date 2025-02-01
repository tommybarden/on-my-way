'use client'

import { getConfirmed } from "@/services/alarms";
import { calculateConfirmed } from "@/utils/helpers";
import { removeSubscription, subscribeToConfirmed } from "@/services/subscriptions";
import { formatTime } from "@/utils/helpers";
import { User } from "@/utils/types";
import { Flame, Truck } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConfirmedList(props: { users: Record<string, User>; alarmId: number; className?: string; }) {
    const [confirmed, setConfirmed] = useState<any[]>([]);
    const { users, alarmId, className } = props;

    useEffect(() => {
        if (!alarmId) return;

        const fetchConfirmed = async () => {
            const confirmed = await getConfirmed(alarmId);

            if (confirmed) {
                const calculatedData = calculateConfirmed(confirmed);
                setConfirmed(calculatedData);
            }
        };

        fetchConfirmed();

        const subscription = subscribeToConfirmed((payload) => {
            const newData = payload.new;
            const oldData = payload.old;

            setConfirmed((prevData) => {

                if (prevData.length < 1) {
                    fetchConfirmed();
                }

                if (newData && oldData) {
                    // Update
                    return calculateConfirmed(
                        prevData.map(item => item.id === oldData.id ? newData : item)
                    );
                }
                if (newData) {
                    // Add new one
                    return calculateConfirmed([...prevData, newData]);
                }
                if (oldData) {
                    // Remove deleted
                    return calculateConfirmed(prevData.filter(item => item.id !== oldData.id));
                }
                return prevData;
            });
        });

        // Decrease every second
        const interval = setInterval(() => {
            setConfirmed(prevState => {
                if (!prevState) return prevState;
                return prevState.map(row => {
                    const updatedRow = { ...row };
                    if (updatedRow.timeLeft > 0) {
                        updatedRow.timeLeft -= 1;
                    }
                    return updatedRow;
                });
            });
        }, 1000);

        // Clear after
        return () => {
            removeSubscription(subscription)
            clearInterval(interval);
        };

    }, [alarmId, users]);

    if (!confirmed) {
        return <p>Laddar...</p>;
    }

    const groups = [
        {
            title: "Far direkt",
            data: confirmed.filter(c => c.minutes < 0)
        },
        {
            title: "På station",
            data: confirmed.filter(c => c.minutes >= 0 && c.timeLeft <= 0)
        },
        {
            title: "På väg",
            data: confirmed.filter(c => c.timeLeft > 0).sort((a, b) => a.timeLeft - b.timeLeft)
        }
    ];

    if (confirmed.length < 1) {
        return ""
    }

    return (
        <div className={className + ' p-4 lg:text-3xl xl:text-4xl'}>
            <div className="flex w-full flex-col gap-5">
                <strong>Insatsstyrka</strong>

                {groups.map(({ title, data }) => (
                    data.length > 0 && (
                        <div key={title}>
                            <div className="text-lg font-bold mt-4 flex items-center justify-center gap-2">
                                <span className="font-light font-stretch-expanded">{title}</span>
                                <span
                                    className="ring-1 ring-gray-300/10 ring-inset rounded px-2">{data.length}</span>
                            </div>
                            <ul role="list" className="divide-y divide-gray-100">
                                {data.map((confirm, i) => {
                                    const user = users[confirm.created_by];
                                    return (
                                        <li key={i} className="flex items-center justify-between py-3 gap-3 xl:py-5">
                                            <div className="flex flex-row gap-1 items-center">

                                                <span>{user?.truck ?
                                                    <Truck className="w-5 h-5 opacity-80" color="#4783B5"
                                                        strokeWidth={1} /> : <span className='w-5 block' />}</span>
                                                <span>{user?.smoke ?
                                                    <Flame className="w-5 h-5 opacity-50" fill="#FF4D00"
                                                        strokeWidth={0} /> : <span className='w-5 block' />}</span>
                                                <span
                                                    className="truncate max-w-full max-w-1/3">{user?.first_name} {user?.last_name}</span>

                                            </div>
                                            <span style={{ fontFamily: 'Courier New, monospace' }}>
                                                {confirm.timeLeft > 0 ? formatTime(confirm.timeLeft) : ""}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

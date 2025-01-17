'use client'

import { getConfirmed } from "@/services/alarms";
import { useEffect, useState } from "react";

export default function ConfirmedList(props: {alarmId: number; className?: string;}) {
    const [confirmed, setConfirmed] = useState<any>(null);
    const { alarmId, className } = props;

    useEffect(() => {
        if (!alarmId) return;
    
        const fetchConfirmed = async () => {
          const data = await getConfirmed(alarmId);
          console.log(data)
          setConfirmed(data);
        };
    
        fetchConfirmed();
      }, [alarmId]); // Körs om `alarmId` ändras


      if (!confirmed) {
        return <p>Laddar...</p>;
      }

    return (
        <div className={props.className + ' p-4'}>
            <div className="flex w-full flex-col gap-5">
                <strong>Insatsstyrka</strong>
                <ol>
                    {confirmed.map((person:any, i:number) => (
                        <li key={i}>{ person.minutes }</li>
                    ))}
                </ol>
            </div>
        </div>
    )
}
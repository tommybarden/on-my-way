import {getConfirmed} from "@/services/client/alarms";
import {getStartedUnits} from "@/services/client/units";
import {getAllUsers} from "@/services/server/users";
import {Alarm} from "@/utils/types";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default async function AlarmDetails(props: { alarm: Alarm; className?: string; }) {
    const {alarm, className} = props;

    const users = await getAllUsers();
    const confirmed = await getConfirmed(alarm.id ?? 0);
    const units = (await getStartedUnits(alarm.id ?? 0)).map(unit => ({
        unit: unit.unit,
        left: new Date(unit.created_at)
    }));

    interface CrewMember {
        arrived: Date;
        direct: boolean;
        unit: string;
        first_name: string;
        last_name?: string;
        number?: number;
    }

    const crew: CrewMember[] = confirmed.map(row => {

        const user = Object.values(users).find(user => user.id === row.created_by);

        row.created_at = new Date(row.created_at)
        if (row.minutes) {
            row.created_at.setMinutes(row.created_at.getMinutes() + row.minutes);
        }

        const unit = units.find(unit => {
            return unit.left.getTime() >= row.created_at.getTime()
        });

        return {
            arrived: row.created_at,
            direct: row.minutes < 0,
            unit: row.minutes ? unit?.unit ?? 'Övriga' : 'Egen bil',
            ...(user ? {
                first_name: user.first_name,
                last_name: user.last_name,
                number: user.number
            } : {
                first_name: 'Okänd användare',
                last_name: '',
                number: 0,
            })
        }

    }).sort((a, b) => a.arrived - b.arrived);

    const groupedByUnit: Record<string, CrewMember[]> = crew.reduce((list, person) => {
        if (!list[person.unit]) {
            list[person.unit] = [];
        }

        list[person.unit].push(person);

        return list;
    }, {} as Record<string, CrewMember[]>);

    const formatDate = (timestring: string) => {
        const date = new Date(timestring);

        return date.toLocaleString('sv-FI', {
            timeZone: 'Europe/Mariehamn',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
    }

    return (
        <div className={className + ''}>
            <div className="text-2xl mb-4">Larmdetaljer</div>

            <div className="flex flex-col gap-4">
                {/* Rad 1: Händelse */}
                <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="font-semibold w-36">Händelse:</div>
                    <div>{alarm.description.split('.')[1]?.replace("Händelse:", "").trim()}</div>
                </div>

                {/* Rad 2: Adress */}
                <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="font-semibold w-36">Adress:</div>
                    <div>{alarm.location}</div>
                </div>

                {/* Rad 3: Datum/Klockslag */}
                <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="font-semibold w-36">Datum/Klockslag:</div>
                    <div>{alarm.created_at ? formatDate(alarm.created_at) : '-'}</div>
                </div>

                {/* Rad 4: Larmtyp */}
                <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="font-semibold w-36">Larmtyp:</div>
                    <div>{alarm.description.split('.')[0]}</div>
                </div>

                {/* Rad 5: Manskap/Fordon */}
                <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="font-semibold w-36">Manskap/Fordon:</div>
                    <div className="flex flex-col gap-4">
                        {Object.keys(groupedByUnit).map(unit => (
                            <div key={unit} className="flex flex-col pb-4">
                                <div className="text-xl">{unit}</div>

                                <div className="pl-8">
                                    {groupedByUnit[unit].map(crew => (
                                        <div className="flex flex-row" key={crew.number}>
                                            <div className="w-10">{crew.number}</div>
                                            <div>{crew.first_name} {crew.last_name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="flex justify-end my-4">
                <Link href={{pathname: "https://www.raddning.ax/node/add/alarmreport"}} target="_blank">
                    <Button size={"lg"} variant={"destructive"}>Skriv
                        rapport &raquo;</Button>
                </Link>
            </div>

        </div>
    )
}
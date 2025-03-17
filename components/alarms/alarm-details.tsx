import {getConfirmed} from "@/services/client/alarms";
import {getStartedUnits} from "@/services/client/units";
import {getAllUsers} from "@/services/server/users";
import {Alarm} from "@/utils/types";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default async function AlarmDetails(props: { alarm: Alarm; className?: string }) {
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
        row.created_at = new Date(row.created_at);

        if (row.minutes) {
            row.created_at.setMinutes(row.created_at.getMinutes() + row.minutes);
        }

        const unit = units.find(unit => unit.left.getTime() >= row.created_at.getTime());

        return {
            arrived: row.created_at,
            direct: row.minutes < 0,
            unit: row.minutes < 0 ? "Egen bil" : unit?.unit ?? "Övriga",
            ...(user ? {
                first_name: user.first_name,
                last_name: user.last_name,
                number: user.number
            } : {
                first_name: "Okänd användare",
                last_name: "",
                number: 0,
            })
        };
    }).sort((a, b) => a.arrived.getTime() - b.arrived.getTime());

    const groupedByUnit: Record<string, CrewMember[]> = {};

    units.forEach(unit => groupedByUnit[unit.unit] = []);
    groupedByUnit["Egen bil"] = [];
    groupedByUnit["Övriga"] = [];

    crew.forEach(person => {
        if (!groupedByUnit[person.unit]) {
            groupedByUnit[person.unit] = [];
        }
        groupedByUnit[person.unit].push(person);
    });

    const formatDate = (timestring: string) => {
        const date = new Date(timestring);
        return date.toLocaleString("sv-FI", {
            timeZone: "Europe/Mariehamn",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
    };

    return (
        <div className={className || ""}>
            <div className="text-2xl mb-4">Larmdetaljer</div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="font-semibold w-36">Händelse:</div>
                    <div>{alarm.description.split(".")[1]?.replace("Händelse:", "").trim()}</div>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="font-semibold w-36">Adress:</div>
                    <div>{alarm.location}</div>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="font-semibold w-36">Datum/Klockslag:</div>
                    <div>{alarm.created_at ? formatDate(alarm.created_at) : "-"}</div>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="font-semibold w-36">Larmtyp:</div>
                    <div>{alarm.description.split(".")[0]}</div>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-4">
                    <div className="font-semibold w-36">Manskap/Fordon:</div>
                    <div className="flex flex-col gap-4">
                        {Object.keys(groupedByUnit).map(unit => (
                            <div key={unit} className="flex flex-col pb-4">
                                <div className="flex flex-row items-center">
                                    <span className="text-xl">{unit}</span>&nbsp;
                                    <span className="text-red-500 ml-4">
                                        {groupedByUnit[unit].length > 0 ? '(' + groupedByUnit[unit].length + ')' : ''}
                                    </span>
                                </div>
                                <div className="pl-8">
                                    {groupedByUnit[unit].length > 0 ? (
                                        groupedByUnit[unit].map(crew => (
                                            <div className="flex flex-row" key={crew.number}>
                                                <div className="w-10">{crew.number}</div>
                                                <div>{crew.first_name} {crew.last_name}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="italic text-gray-500">Inget manskap</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end my-4">
                <Link href={{pathname: "https://www.raddning.ax/node/add/alarmreport"}} target="_blank">
                    <Button size={"lg"} variant={"destructive"}>Skriv rapport &raquo;</Button>
                </Link>
            </div>
        </div>
    );
}
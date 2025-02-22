import { User } from "@/utils/types";
import { Contact } from "lucide-react";

export default function UsersList(props: { users: Record<string, User>; className?: string; }) {
    const { users, className } = props;

    if (!users) {
        return null
    }

    const sortedUsers = Object.values(users).sort((a, b) => (a.last_name + a.first_name).localeCompare(b.last_name + b.first_name, 'sv'))

    return (
        <div className={className + ' lg:text-2xl xl:text-3xl'}>

            <div className="lg:text-5xl xl:text-6xl text-center pb-4">Användare</div>

            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {sortedUsers.map((person) => (
                    <li key={person.id} className="flex flex-col items-center justify-center p-4 bg-gray-800 text-white shadow-md border-l-4 border-gray-200 rounded-r-xl space-y-2">

                        <div className="flex flex-row gap-2 items-center">
                            <Contact color="#ff0000" strokeWidth={1} className="w-8 h-8" />
                            <div className="font-light tracking-wide text-gray-300">{person.number}</div>
                        </div>

                        <div className="font-semibold text-center">
                            {person.last_name} {person.first_name}
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    )
}
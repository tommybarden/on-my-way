import { User } from "@/utils/types";
import { Contact } from "lucide-react";

export default function UsersList(props: { users: Record<string, User>; className?: string; }) {
    const { users, className } = props;

    const sortedUsers = Object.values(users).sort((a, b) => (a.last_name + a.first_name).localeCompare(b.last_name + b.first_name, 'sv'))

    return (
        <div>
            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sortedUsers.map((person) => (
                    <li className="flex flex-col items-center justify-center p-4 bg-gray-800 text-white shadow-md border-l-4 border-gray-200 rounded-r-xl space-y-2">

                        <div className="flex flex-row gap-2 items-center">
                            <Contact color="#ff0000" strokeWidth={1} className="w-6 h-6" />
                            <div className="text-2xl font-light tracking-wide text-gray-300">{person.number}</div>
                        </div>

                        <div className="text-lg font-semibold text-center">
                            {person.last_name} {person.first_name}
                        </div>

                    </li>
                ))}
            </ul>
        </div>
    )
}
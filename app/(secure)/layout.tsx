import { getCurrentUser } from "@/services/users";
import {redirect} from "next/navigation";

export default async function Layout({children,}: {
    children: React.ReactNode;
}) {

    const user = await getCurrentUser()

    if (!user) {
        return redirect("/sign-in?");
    }

    return (
        <div className="loggedin max-w-7xl flex flex-col gap-12 items-start">{children}</div>
    );
}

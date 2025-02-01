import { getCurrentUser } from "@/services/server/users";
import { redirect } from "next/navigation";

export default async function Layout({ children, }: {
    children: React.ReactNode;
}) {

    const user = await getCurrentUser()

    if (!user) {
        return redirect("/sign-in?");
    }

    return (
        <>
            {children}
        </>
    );
}

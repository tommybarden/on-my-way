import { getCurrentUser } from "@/services/users";
import { redirect } from "next/navigation";

export default async function Layout({ children, }: {
    children: React.ReactNode;
}) {

    const user = await getCurrentUser()

    if (!user) {
        return redirect("/sign-in?");
    }

    return (
        <div className="dashboard md:w-screen w-auto px-6 flex flex-col lg:flex-row Xgap-2 items-start justify-around ">
            {children}
        </div>
    );
}

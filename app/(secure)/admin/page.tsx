import UserForm from "@/components/admin/user-form";
import { getCurrentUser } from "@/services/users";

export default async function AdminPage() {

    const user = await getCurrentUser();

    if (!user || !user.id) {
        return
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-2">
            <UserForm className="rounded-md border-accent border-2" />
            <UserForm user={{ ...user, id: user?.id ?? 'default-id' }} className="rounded-md border-accent border-2" />
        </div>
    );
}

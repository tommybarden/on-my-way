import CreateUserForm from "@/components/admin/create-user-form";

export default async function AdminPage() {

    return (
        <div className="flex-1 w-full flex flex-col gap-2">
            <CreateUserForm className="rounded-md border-accent border-2"/>
        </div>
    );
}

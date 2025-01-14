import {createAdminClient, createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

export default async function ProtectedPage() {

    const supabase = await createClient();
    const supabaseAdmin = await createAdminClient();

    const {data, error} = await supabaseAdmin.auth.admin.createUser({
        phone: '+358503728129',
        password: 'hemligt',
        phone_confirm: true,
        user_metadata: {
            first_name: 'Tommy',
            last_name: 'Bärdén',
            number: 20
        },
    });

    console.log(data, error)


    const {data: {user}} = await supabase.auth.getUser();

    // const {data, error} = await supabase.auth.signUp(
    //     {
    //         phone: '+358503728129',
    //         password: 'password',
    //
    //     },
    // )
    //
    // console.log(data, error)

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-12">

            Admin hit

        </div>
    );
}

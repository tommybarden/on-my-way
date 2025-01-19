import { createAdminClient } from '@/utils/supabase/server';
import {createClient} from "@/utils/supabase/server";
import { User } from '@/utils/types';

export const getCurrentUser = async () => {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    return user
}

export const getAllUsers = async (): Promise<Record<string, User>> => {
    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error; // Hantera fel

    const users = data?.users || []; // Se till att users alltid är en array

    const userData: User[] = users
        .filter((user) => user.phone) // Filtrera ut användare utan telefonnummer
        .map((user) => ({
            id: user.id,
            phone: user.phone ?? '',
            first_name: user.user_metadata?.first_name || "Okänd",
            last_name: user.user_metadata?.last_name || "Okänd",
            number: user.user_metadata?.number || 0,
        }));

    // Korrekt typning i reduce
    const usersById: Record<string, User> = userData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {} as Record<string, User>);

    return usersById;
};

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
        acc[user.id ?? 0] = user;
        return acc;
    }, {} as Record<string, User>);

    return usersById;
};

export const createUser = async (user: User) => {
    const supabaseAdmin = createAdminClient();

console.log(user)

    if(!user.phone || !user.first_name || !user.last_name) {
        return false
    }

    const {data, error} = await supabaseAdmin.auth.admin.createUser({
        phone: user.phone,
        password: process.env.DEFAULT_USER_PASSWORD ?? 'OMW',
        phone_confirm: true,
        user_metadata: {
            first_name: user.first_name,
            last_name: user.last_name,
            number: user.number
        },
    });

    if(!data || !data.user) {
        return false
    }

    return data.user
};
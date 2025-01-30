'use server'
import { createAdminClient } from '@/utils/supabase/server';
import { createClient } from "@/utils/supabase/server";
import { User } from '@/utils/types';
import { redirect } from "next/navigation";

export const getCurrentUser = async (): Promise<User | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        console.error("Fel vid hämtning av användare:", error?.message);
        return null; // Returnera null istället för ett tomt objekt
    }

    const user = data.user;
    const metadata = user.user_metadata || {}; // Säkerställ att metadata finns

    const userData: User = {
        id: user.id,
        phone: user.phone ?? '',
        first_name: metadata.first_name || "Okänd",
        last_name: metadata.last_name || "Okänd",
        number: metadata.number || "",
        truck: metadata.truck || false,
        smoke: metadata.smoke || false
    };

    return userData;
};

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
            number: user.user_metadata?.number || "",
            truck: user.user_metadata?.truck || false,
            smoke: user.user_metadata?.smoke || false
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

    if (!user.phone || !user.first_name || !user.last_name) {
        return false
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        phone: user.phone,
        password: process.env.DEFAULT_USER_PASSWORD ?? 'OMW',
        phone_confirm: true,
        user_metadata: {
            first_name: user.first_name,
            last_name: user.last_name,
            number: user.number,
            smoke: user.smoke,
            truck: user.truck
        },
    });

    if (!data || !data.user) {
        return false
    }

    return data.user
};

export const updateUser = async (user: User) => {
    const supabase = await createClient();

    if (!user.phone || !user.first_name || !user.last_name) {
        return false
    }

    console.log('Uppdaterar!', user)

    const { data, error } = await supabase.auth.updateUser({
        data: {
            first_name: user.first_name,
            last_name: user.last_name,
            number: user.number,
            smoke: user.smoke,
            truck: user.truck
        },
    });

    if (!data || !data.user) {
        return false
    }

    return data.user
}
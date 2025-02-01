import { createAdminClient } from "@/utils/supabase/server";

export const writeToLog = async (category: string, message: string) => {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('Log')
        .insert([{ category, message }])
        .select();

    if (error) {
        console.error("Error inserting log:", error);
    }

    return data
}
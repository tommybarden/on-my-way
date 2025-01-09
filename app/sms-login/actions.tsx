// app/sms-login/actions.ts

"use server";

import {cookies} from "next/headers";
import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import {redirect} from "next/navigation";

export const signIn = async (formData: FormData) => {
    "use server";
    const phone = formData.get("phone") as string;
    const supabase = createRouteHandlerClient({cookies})

    const {error} = await supabase.auth.signInWithOtp({
        phone,
    });

    if (error) {
        return redirect("/sms-login?message=Could not authenticate user");
    }

    return redirect("/sms-login?message=Check your phone for the OTP");
};

export const verifyOTP = async (formData: FormData) => {
    "use server";
    const phone = formData.get("phone") as string;
    const token = formData.get("token") as string;
    const supabase = createRouteHandlerClient({cookies})

    const {error} = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
    });

    if (error) {
        console.error(error);
        return redirect("/sms-login?message=Could not authenticate user");
    }

    return redirect("/");
};
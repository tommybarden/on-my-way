import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const formData = await request.formData()
    const phone = String(formData.get('phone'))
    const otp = String(formData.get('otp'))
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { session }, error } = await supabase.auth.verifyOtp({ phone: phone, token: otp, type: "sms" });

    if (error) {
      throw error
    }

    return NextResponse.redirect(requestUrl.origin + '/profile', {
        status: 301,
    })
}
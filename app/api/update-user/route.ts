import { getCurrentUser, updateUser } from "@/services/server/users";
import { User } from "@/utils/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const user = await getCurrentUser()

    if (!user) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const data = await request.json();

    if (!data.phone || !data.firstName || !data.lastName) {
        return NextResponse.json({ data, error: 'Missing data' }, { status: 406 })
    }

    const userData: User = {
        phone: data.phone,
        first_name: data.firstName,
        last_name: data.lastName,
        number: data.unitNumber,
        truck: data.truck,
        smoke: data.smoke
    }

    const updatedUser = await updateUser(userData)

    if (updatedUser) {
        return NextResponse.json({ updatedUser }, { status: 200 })
    }

    return NextResponse.json({ error: 'Nope.', updatedUser }, { status: 500 })
}
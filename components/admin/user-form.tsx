"use client";
import { useState } from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "../ui/switch";
import { User } from "@/utils/types";

export default function UserForm({
    className,
    user,
}: {
    className?: string;
    user?: User;
}) {
    const [phone, setPhone] = useState(user?.phone || "");
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");
    const [unitNumber, setUnitNumber] = useState(user?.number?.toString() || "");
    const [smoke, setSmoke] = useState(user?.smoke ?? false);
    const [truck, setTruck] = useState(user?.truck ?? false);

    const isEditing = !!user;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = isEditing ? "/api/update-user" : "/api/create-user";

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: user?.id, // Endast vid uppdatering
                phone,
                firstName,
                lastName,
                unitNumber, // Säkerställ att det är en siffra
                truck,
                smoke,
            }),
        });

        if (response.ok) {
            alert(isEditing ? "Användare uppdaterad!" : "Användare skapad!");
        } else {
            alert("Något gick fel.");
        }
    };

    return (
        <div className={className + " p-4"}>
            <div className="flex w-full flex-col gap-5">
                <strong>{isEditing ? "Redigera användare" : "Skapa användare"}</strong>

                <form className="flex flex-col w-full mx-auto" onSubmit={handleSubmit}>
                    {isEditing && <input type="hidden" name="id" value={user?.id} />}

                    <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                        <Label htmlFor="phone">Telefonnummer (inkl. landskod)</Label>
                        <Input
                            name="phone"
                            placeholder="+358457123456"
                            required
                            minLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        <Label htmlFor="first_name">Förnamn</Label>
                        <Input
                            name="first_name"
                            placeholder=""
                            required
                            minLength={2}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />

                        <Label htmlFor="last_name">Efternamn</Label>
                        <Input
                            name="last_name"
                            placeholder=""
                            required
                            minLength={3}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />

                        <Label htmlFor="number">Nummer</Label>
                        <Input
                            name="number"
                            placeholder="20"
                            required
                            minLength={1}
                            value={unitNumber}
                            onChange={(e) => setUnitNumber(e.target.value)}
                        />

                        <div className="flex flex-row justify-evenly mb-4">
                            <div className="flex items-center gap-2">
                                <Switch name="truck" checked={truck} onCheckedChange={setTruck} />
                                <Label htmlFor="truck">Lastbilskort</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch name="smoke" checked={smoke} onCheckedChange={setSmoke} />
                                <Label htmlFor="smoke">Rökdykare</Label>
                            </div>
                        </div>
                        <SubmitButton pendingText={isEditing ? "Uppdaterar användare..." : "Skapar användare..."}>
                            {isEditing ? "Spara ändringar" : "Skapa användare"}
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

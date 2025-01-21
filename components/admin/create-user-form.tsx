"use client"
import {useState} from "react";
import {SubmitButton} from "@/components/default/submit-button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function CreateUserForm(props: { className?: string; }) {
    const [phone, setPhone] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [unitNumber, setUnitNumber] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("/api/create-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phone,
                firstName,
                lastName,
                unitNumber,
            }),
        });

        if (response.ok) {
            alert("Användare skapad!");

            setPhone("")
            setFirstName("")
            setLastName("")
            setUnitNumber("")
        } else {
            alert("Något gick fel.");
        }
    };

    return (
        <div className={props.className + ' p-4'}>
            <div className="flex w-full flex-col gap-5">

                <strong>Skapa användare</strong>

                <form className="flex flex-col min-w-96 max-w-96 mx-auto" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                        <Label htmlFor="phone">Telefonnummer (ink. landskod)</Label>
                        <Input name="phone" placeholder="+358457123456" required minLength={10} value={phone}
                               onChange={(e) => setPhone(e.target.value)}/>

                        <Label htmlFor="first_name">Förnamn</Label>
                        <Input name="first_name" placeholder="" required minLength={2} value={firstName}
                               onChange={(e) => setFirstName(e.target.value)}/>

                        <Label htmlFor="last_name">Efternamn</Label>
                        <Input name="last_name" placeholder="" required minLength={3} value={lastName}
                               onChange={(e) => setLastName(e.target.value)}/>

                        <Label htmlFor="number">Nummer</Label>
                        <Input name="number" placeholder="20" required minLength={1} value={unitNumber}
                               onChange={(e) => setUnitNumber(e.target.value)}/>

                        <SubmitButton pendingText="Skapar användare...">
                            Skapa användare
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

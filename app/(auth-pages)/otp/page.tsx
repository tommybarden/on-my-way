"use client"
import {getOTP, signInWithOtp} from "@/app/actions";
import {Message} from "@/components/form-message";
import {SubmitButton} from "@/components/submit-button";
import {Button} from "@/components/ui/button";
import {defaultCountries, PhoneInput} from 'react-international-phone';
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useState} from "react";
import 'react-international-phone/style.css';

export default function Otp(props: { searchParams: Promise<Message> }) {
    //const searchParams = props.searchParams;
    const [phoneNumber, setPhoneNumber] = useState('');
    //const [otp, setOtp] = useState('');

    const countries = defaultCountries.filter((country) => {
        return country[1] === 'fi'
    });

    return (
        <form className="flex-1 flex flex-col min-w-64 gap-2">
            <h1 className="text-2xl font-medium">Login</h1>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="phone">Telefonnummer</Label>
                <PhoneInput
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e)}
                    name="phone"
                    placeholder="+358123456789"
                    defaultCountry="fi"
                    countries={countries}
                    hideDropdown
                    required
                    className="w-full flex"
                    forceDialCode
                    inputClassName="flex-1"
                />

                <Button type="button" onClick={() => getOTP(phoneNumber)}>Skicka kod</Button>
            </div>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Input
                    type="number"
                    name="otp"
                    placeholder="Din kod"
                    required
                />
                <SubmitButton pendingText="Loggar in..." formAction={signInWithOtp}>Logga in</SubmitButton>

            </div>
        </form>
    );
}

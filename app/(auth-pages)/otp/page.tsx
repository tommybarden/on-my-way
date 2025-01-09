"use client"
import { signInWithOtp, getOTP } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { PhoneInput } from 'react-international-phone';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Otp(props: { searchParams: Promise<Message> }) {
  //const searchParams = props.searchParams;
  const [phoneNumber, setPhoneNumber] = useState('');
  //const [otp, setOtp] = useState('');

  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">Login</h1>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="phone">Telefonnummer</Label>
        <PhoneInput 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e)}
            name="phone" 
            placeholder="+358123456789" 
            defaultCountry="fi"
            hideDropdown
            required 
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

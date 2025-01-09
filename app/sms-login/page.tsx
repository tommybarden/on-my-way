"use client";

import Link from "next/link";
import {signIn, verifyOTP} from "./actions";
import React, {useEffect, useState} from "react";

export default function SMSLogin(
    {searchParams,}: { searchParams: { message: string }; }) {
    const [otpSent, setOtpSent] = useState(false);

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-xl justify-center gap-2">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        className="inline-flex"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                </svg>
                Back
            </Link>
            <h1 className="text-4xl font-bold">Logga in med SMS</h1>
            <p className="text-foreground">
                {otpSent ? 'Skickad' : 'Inte skickad'}
            </p>
            <form
                action={async (formData) => {
                    if (otpSent) {
                        await verifyOTP(formData);
                    } else {
                        try {
                            await signIn(formData);
                            setOtpSent(true);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }}
                className="flex flex-col gap-2"
            >
                <label htmlFor="phone" className="flex flex-col gap-1">
                    <span className="text-foreground">Mobilnummer</span>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        className="rounded-md px-4 py-2 bg-inherit border mb-2"
                        placeholder="+358 1234567890"
                    />
                </label>
                <label
                    htmlFor="token"
                    className={`flex flex-col gap-1 ${otpSent ? "" : "hidden"}`}
                >
                    <span className="text-foreground">Your OTP</span>
                    <input
                        type="text"
                        name="token"
                        id="token"

                        placeholder="123456"
                        className={`rounded-md px-4 py-2 bg-inherit border mb-2`}
                    />
                </label>
                <button
                    type="submit"
                    className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 max-w-max hover:bg-green-600"
                >
                    {otpSent ? "Verify OTP" : "Send OTP"}
                </button>
                {otpSent && <ExpirationTimer/>}
            </form>
        </div>
    );
}

const ExpirationTimer = () => {
    const expirationTime = 60;
    const [timeLeft, setTimeLeft] = useState(expirationTime);

    let id: any = null;

    useEffect(() => {
        if (timeLeft > 0) {
            id = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        }
        return () => {
            clearTimeout(id);
        };
    }, [timeLeft]);

    return (
        <div className="flex justify-between items-center">
            <p className="text-foreground text-sm">
                {timeLeft > 0 ? `OTP expires in ${timeLeft} seconds` : "OTP expired!"}
            </p>
            <button
                className="text-foreground text-sm underline disabled:text-foreground/50 disabled:cursor-not-allowed"
                formAction={async (formData) => {
                    await signIn(formData);
                    setTimeLeft(expirationTime);
                }}
                disabled={timeLeft > 0}
            >
                Resend OTP
            </button>
        </div>
    );
};
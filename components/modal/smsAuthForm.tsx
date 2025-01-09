"use client"
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function SMSAuthForm() {
  const supabase = createClientComponentClient();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
      if (error) throw error;
      // Otp sent successfully
    } catch (error: any) {
      console.error('Error sending OTP:', error.message);
    }
  };

  return (
    <>
      <form action="/auth/smsLogin" method="post" className="space-y-4">
        <div>
          <PhoneInput
            name="phone"
            defaultCountry="fi"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e)}
          />
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-4 border border-gray-400 rounded shadow block mt-2" type="button" onClick={handleSendOtp}>Send OTP</button>
        </div>

        <div>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            type="text"
            placeholder="Enter OTP"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded px-4 py-1 text-center mt-2" type="submit">Verify OTP</button>
        </div>
      </form>
    </>
  );
}

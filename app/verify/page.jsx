// VerifyEmail.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyEmailMutation } from "../store/api/authApi";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [verifyEmail] = useVerifyEmailMutation();
  const [timer, setTimer] = useState(30);
  const [resending, setResending] = useState(false);
  
  const inputRefs = useRef([]);
  
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Watch OTP fields to enable/disable button
  const otp1 = watch("otp1", "");
  const otp2 = watch("otp2", "");
  const otp3 = watch("otp3", "");
  const otp4 = watch("otp4", "");
  const allFieldsFilled = otp1 && otp2 && otp3 && otp4;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (formData) => {
    const otp = `${formData.otp1}${formData.otp2}${formData.otp3}${formData.otp4}`;
    const result = await verifyEmail({ email, OTP: otp });

    if (result?.data) {
      router.push("/signin");
    } else if (result?.error) {
      const message = result.error.data?.message || "Invalid verification code";
      setError("otp1", { message });
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    await verifyEmail({ email, OTP: "0000" });
    setTimer(30);
    setResending(false);
  };

  // Handle OTP input changes and auto-focus
  const handleOtpChange = (index, value) => {
    setValue(`otp${index + 1}`, value);
    
    // Focus next input if value entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Focus previous input if backspace pressed
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Verify Email</h2>
        
        <p className="text-gray-600 mb-6">
          We've sent a verification code to the email address you
          <br />
          provided. To complete the verification process, please
          <br />
          enter the code here.
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          Sent to: <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center gap-4 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                inputMode="numeric"
                autoFocus={index === 0}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-16 h-16 text-center text-2xl border border-gray-300 rounded-lg 
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                           transition-colors"
                {...register(`otp${index + 1}`, {
                  required: true,
                  pattern: /^[0-9]$/,
                  onChange: (e) => handleOtpChange(index, e.target.value),
                })}
              />
            ))}
          </div>

          {errors.otp1 && (
            <p className="text-red-500 text-sm text-center mb-4">
              {errors.otp1.message}
            </p>
          )}

          <div className="text-sm text-gray-500 mb-8">
            <p>
              You can request to{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={timer > 0}
                className={`font-medium ${
                  timer === 0 
                    ? "text-indigo-600 hover:text-indigo-800 cursor-pointer" 
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                Resend code
              </button>{" "}
              in 0:{timer.toString().padStart(2, "0")}
            </p>
          </div>

          <button
            type="submit"
            disabled={!allFieldsFilled}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              allFieldsFilled
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
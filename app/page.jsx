"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSignupMutation } from "./store/api/authApi"; // adjust path as needed

export default function Signup() {
  const router = useRouter();
  const [signup] = useSignupMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const result = await signup({ ...formData, role: "user" });

    if (result?.data) {
      router.push(`/verify?email=${formData.email}`);
    } else if (result?.error) {
      const errMessage = result.error.data?.message || "Signup failed";
      if (errMessage.toLowerCase().includes("email")) {
        setError("email", { message: errMessage });
      } else {
        setError("name", { message: errMessage });
      }
    }
  };

  const handleGoogleSignup = () => {
    signIn("google", {
      callbackUrl: "/welcome",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Sign Up Today!
        </h2>

        <button
          onClick={handleGoogleSignup}
          className="w-full border border-gray-300 flex items-center justify-center py-2 rounded mb-4 hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Sign Up with Google
          </span>
        </button>

        <div className="text-center text-sm text-gray-500 mb-4">
          or Sign Up with Email
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            {...register("name", { required: "Full name is required" })}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border rounded text-sm"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}

          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Enter email address"
            className="w-full px-4 py-2 border rounded text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}

          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Enter password"
            className="w-full px-4 py-2 border rounded text-sm"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}

          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
            })}
            placeholder="Enter password"
            className="w-full px-4 py-2 border rounded text-sm"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 rounded text-sm"
          >
            Continue
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
          </a>
        </div>

        <p className="text-[10px] text-gray-500 mt-4 text-center">
          By clicking Continue, you acknowledge that you have read and accepted
          our{" "}
          <a href="/terms" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

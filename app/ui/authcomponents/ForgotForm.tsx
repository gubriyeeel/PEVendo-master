"use client";
// TODO: Add error handling messages

import Link from "next/link";
import { LogInState, logIn } from "@/app/lib/authactions";
import { useActionState } from "react";

const LoginForm = () => {
  const initialState: LogInState = { message: "", errors: {} };
  const [error, action] = useActionState(logIn, initialState);

  return (
    // LoginForm
    <div className="flex h-full flex-col items-center justify-center gap-y-5 rounded-xl py-3 md:w-7/12 md:gap-y-4 md:px-32 md:py-16">
      <h1 className="text-center text-2xl font-bold">Forgot Password</h1>
      <h2>Please enter your email to reset your password</h2>
      <form action={action} className="flex flex-col gap-y-6 md:gap-y-4">
        <input name="email" type="email" id="email" placeholder="email" />

        <button
          className="bg-reddish-100 rounded-xl px-14 py-3 text-white"
          type="submit"
        >
          Continue
        </button>
        <Link
          href="/"
          className="rounded-xl bg-gray-500 px-14 py-3 text-center text-white"
          type="submit"
        >
          Cancel
        </Link>
      </form>
      <div id="Login Error" aria-live="polite" aria-atomic="true">
        {error.message ? (
          <p className="text-sm text-red-500" key={error.message}>
            {error.message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default LoginForm;

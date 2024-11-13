"use client";
// TODO: Add error handling messages

import Link from "next/link";
import { LogInState, logIn } from "@/app/lib/authactions";
import { useActionState, useState } from "react";

const LoginForm = () => {
  const initialState: LogInState = { message: "", errors: {} };
  const [isLoading, setIsLoading] = useState(false);
  const [error, action] = useActionState(logIn, initialState);

  return (
    // LoginForm
    <div className="flex h-full flex-col items-center justify-center gap-y-5 rounded-xl py-3 md:w-7/12 md:gap-y-4 md:px-32 md:py-16">
      <h1 className="text-center text-2xl font-bold">Login your account</h1>
      <form action={action} className="flex flex-col gap-y-6 md:gap-y-4">
        <input name="email" type="email" id="email" placeholder="email" />
        <input
          name="password"
          type="password"
          id="password"
          placeholder="password"
        />
        <button
          className={`bg-reddish-100 rounded-xl px-14 py-3 text-white`}
          type="submit"
          onClick={() => setIsLoading(true)}
        >
          {isLoading ? "Loggin in..." : "Login"}
        </button>
      </form>
      <div id="Login Error" aria-live="polite" aria-atomic="true">
        {error.message ? (
          <p className="text-sm text-red-500" key={error.message}>
            {error.message}
          </p>
        ) : null}
      </div>

      <Link className="text-blue-400" href="/forgot">
        Forgot Password?
      </Link>
      {/* Register */}
      <div className="flex w-10/12 gap-x-2 text-center md:w-auto md:text-left">
        <p className="text-gray-400">{"Don't"} have an account?</p>
        <Link className="text-blue-400" href="/signup">
          Sign up here
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;

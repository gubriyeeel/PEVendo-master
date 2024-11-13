"use client";

import Link from "next/link";
import Html5QrcodePlugin from "@/app/ui/authcomponents/QRCodeScanner";
import { SignUpState, signUp } from "@/app/lib/authactions";
import { useActionState, useEffect, useRef, useState } from "react";

const SignupForm = () => {
  const initialState: SignUpState = { message: null, errors: {} };
  const [error, action, isPending] = useActionState(signUp, initialState);
  const [qrState, setQrState] = useState<string | null>(null);
  const [FormData, setFormData] = useState({
    name: "",
    student_id: "",
    course: "",
    year: "",
    email: "",
    password: "",
    confirm_password: "",
    qr_code: "",
  });
  const QrRef = useRef<HTMLInputElement>(null);

  const onNewScanResult = (decodedText: any, decodedResult: any) => {
    setFormData((prevData) => ({ ...prevData, qr_code: decodedText }));
    setQrState(decodedText);
    QrRef!.current!.value = decodedText;
  };

  useEffect(() => {
    if (qrState) {
      QrRef!.current!.value = qrState;
    }
  }, [qrState, error]);

  return (
    // Sign Up Form
    <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-xl border-2 border-black px-3 py-8 md:w-7/12 md:px-32">
      <h1 className="text-center text-2xl font-bold">Sign Up</h1>
      {/* FormData 
      <div className="flex w-full flex-col gap-y-2">
        <p>{FormData.qr_code.split(" ")[0]}</p>
        <p>{FormData.qr_code.split(" ")[1]}</p>
        <p>{FormData.name}</p>
        <p>{FormData.student_id}</p>
      </div> */}
      <form
        id="signupForm"
        action={action}
        className="flex w-full flex-col gap-y-2"
      >
        {/* Name */}
        <label>
          <span className="font-bold">Full Name</span>
        </label>
        <input
          className="uppercase"
          name="name"
          type="text"
          id="name"
          placeholder="Juan D. Luna"
          value={FormData.name}
          onChange={(e) => setFormData({ ...FormData, name: e.target.value })}
        />
        <div id="Name Error" aria-live="polite" aria-atomic="true">
          {error?.errors?.name ? (
            <p className="text-sm text-red-500" key={error.message}>
              {error.errors.name}
            </p>
          ) : null}
        </div>
        {/* Student ID */}
        <label>
          <span className="font-bold">Student ID</span>
        </label>
        <input
          className="uppercase"
          name="student_id"
          type="text"
          id="student_id"
          placeholder="TUPC-01-2345"
          value={FormData.student_id}
          onChange={(e) =>
            setFormData({ ...FormData, student_id: e.target.value })
          }
        />
        <div id="Student ID Error" aria-live="polite" aria-atomic="true">
          {error?.errors?.student_id ? (
            <p className="text-sm text-red-500" key={error.message}>
              {error.errors.student_id}
            </p>
          ) : null}
        </div>
        {/* Course */}
        <label>
          <span className="font-bold">Course</span>
        </label>
        <input
          className="uppercase"
          name="course"
          type="text"
          id="course"
          placeholder="BETCOET"
          value={FormData.course}
          onChange={(e) => setFormData({ ...FormData, course: e.target.value })}
        />
        <div id="Course Error" aria-live="polite" aria-atomic="true">
          {error?.errors?.course ? (
            <p className="text-sm text-red-500" key={error.message}>
              {error.errors.course}
            </p>
          ) : null}
        </div>
        {/* Year */}
        <label>
          <span className="font-bold">Year</span>
        </label>
        <input
          name="year"
          type="number"
          id="year"
          placeholder="4"
          value={FormData.year}
          onChange={(e) => setFormData({ ...FormData, year: e.target.value })}
        />
        <div id="Year Error" aria-live="polite" aria-atomic="true">
          {error?.errors?.year ? (
            <p className="text-sm text-red-500" key={error.message}>
              {error.errors.year}
            </p>
          ) : null}
        </div>
        {/* Email */}
        <label>
          <span className="font-bold">Email</span>
        </label>
        <input
          name="email"
          type="email"
          id="email"
          placeholder="juandluna@email.com"
          value={FormData.email}
          onChange={(e) => setFormData({ ...FormData, email: e.target.value })}
        />
        <div id="Email Error" aria-live="polite" aria-atomic="true">
          {error?.errors?.email ? (
            <p className="text-sm text-red-500" key={error.message}>
              {error.errors.email}
            </p>
          ) : null}
        </div>
        {/* Password */}
        <label>
          <span className="font-bold">Password</span>
        </label>
        <input name="password" type="password" id="password" />
        <div id="password Error" aria-live="polite" aria-atomic="true">
          {error?.errors?.password ? (
            <p className="text-sm text-red-500" key={error.message}>
              {error.errors.password}
            </p>
          ) : null}
        </div>
        <label>
          <span className="font-bold">Confirm password</span>
        </label>
        <input name="confirm_password" type="password" id="confirm_password" />
        <div id="password Error" aria-live="polite" aria-atomic="true">
          {error?.errors?.confirm_password ? (
            <p className="text-sm text-red-500" key={error.message}>
              {error.errors.confirm_password}
            </p>
          ) : null}
        </div>
        {/* QR Code */}
        <label>
          <span className="font-bold">Scan QR Code</span>
        </label>
        <input
          ref={QrRef}
          type="text"
          id="qr_code"
          name="qr_code"
          className="hidden"
          value={FormData.qr_code}
          onChange={(e) =>
            setFormData({ ...FormData, qr_code: e.target.value })
          }
        />
        {!FormData.qr_code && (
          <div className={`w-full`}>
            <Html5QrcodePlugin
              fps={10}
              qrbox={250}
              disableFlip={false}
              verbose={false}
              qrCodeSuccessCallback={onNewScanResult}
            />
          </div>
        )}
        {FormData.qr_code && (
          <span className="w-full bg-green-400 text-center font-bold">
            QR Code Scanned successfully!
          </span>
        )}

        <div id="QE Error" aria-live="polite" aria-atomic="true">
          {error?.errors?.qr_code ? (
            <p className="text-sm text-red-500" key={error.message}>
              {error.errors.qr_code}
            </p>
          ) : null}
        </div>
        <div id="Login Error" aria-live="polite" aria-atomic="true">
          {error?.message ? (
            <p className="text-center text-sm text-red-500" key={error.message}>
              {error.message}
            </p>
          ) : null}
        </div>

        <button
          className="rounded-xl bg-reddish-100 px-14 py-3 text-white"
          type="submit"
        >
          Sign Up
        </button>
        <span className="text-center">
          Already have an account?{" "}
          <Link className="text-blue-500" href={"/"}>
            Log in{" "}
          </Link>
        </span>
      </form>
    </div>
  );
};

export default SignupForm;

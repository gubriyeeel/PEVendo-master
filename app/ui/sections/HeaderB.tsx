// Header when student account is logged in

"use client";

import React, { useEffect } from "react";
import { signOut } from "@/app/lib/authactions";
import { getUser } from "@/app/lib/authactions";
import { useState } from "react";
import Hamburger from "hamburger-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

const HeaderB = () => {
  const [open, setOpen] = useState(false);
  const [user, setuser] = useState<User | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      const { data, error } = await getUser();
      if (data.user) {
        setuser(data.user);
        console.log(data.user);
      }
    };
    getUserData();
  }, []);

  const links = [
    { name: "Home", link: "/" },
    { name: "Request", link: "/request" },
    { name: "Uniform", link: "/uniform" },
  ];

  return (
    //
    <div className="bg-reddish-100 flex w-full flex-col items-center justify-center overflow-hidden shadow-md md:h-[15vh]">
      {/* Main */}
      <div className="flex w-full items-center justify-between px-3 py-1 md:w-11/12 md:py-4">
        {/* Logo  */}
        <div className="flex w-max items-center gap-x-8">
          {" "}
          <div className="flex aspect-square items-center justify-center rounded-full border-2 border-black bg-white p-2">
            Logo
          </div>
          <ul
            className={`hidden w-max items-center justify-center gap-x-9 overflow-hidden md:flex md:w-auto md:justify-evenly ${open ? "py-3" : "p-0"}`}
          >
            {links.map((item) => {
              return (
                <Link key={item.name} href={item.link}>
                  <li className="text-xl text-white">{item.name}</li>
                </Link>
              );
            })}
          </ul>{" "}
        </div>
        <div className="flex gap-x-8">
          {user && (
            <h1 className="hidden py-1 text-xl text-white md:block">
              Hello {user.user_metadata?.name}!
            </h1>
          )}
          <button
            onClick={async () => {
              await signOut();
              setOpen(false);
            }}
            className="hidden py-1 text-xl text-white md:block"
          >
            Sign Out
          </button>
        </div>
        {/* Hamburger button */}
        <div
          onClick={() => setOpen(!open)}
          className="cursor-pointer justify-self-end md:hidden"
        >
          <Hamburger
            color="#FFFFFF"
            size={28}
            toggled={open}
            toggle={setOpen}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      <div
        className={`bg-Maroon grid w-full overflow-hidden transition-all duration-300 ease-in-out ${open ? `grid-rows-[1fr] opacity-100` : `grid-rows-[0fr] opacity-0`}`}
      >
        <div
          className={`bg-Maroon flex w-full flex-col items-center justify-center gap-y-2 overflow-hidden ${open ? "py-3" : "p-0"}`}
        >
          {links.map((item) => {
            return (
              <Link
                key={item.link}
                href={item.link}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <div className="py-1 text-2xl text-white">{item.name}</div>
              </Link>
            );
          })}
          <button
            onClick={async () => {
              await signOut();
              setOpen(false);
            }}
            className="py-1 text-2xl text-white"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderB;

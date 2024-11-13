// Header when no account is logged in

"use client";

import React, { useEffect } from "react";
import { signOut } from "@/app/lib/authactions";
import { useState } from "react";
import Hamburger from "hamburger-react";
import Link from "next/link";

const HeaderA = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
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
        <ul
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
                <li className="py-1 text-2xl text-white">{item.name}</li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default HeaderA;

"use client";

import { useState } from "react";
import Hamburger from "hamburger-react";

const HeaderA = () => {
  const [open, setOpen] = useState(false);

  return (
    //
    <div className="flex w-full flex-col items-center justify-center overflow-hidden bg-reddish-100 shadow-md md:h-[15vh]">
      {/* Main */}
      <div className="flex w-full items-center justify-between px-3 py-1 md:w-11/12 md:py-4">
        {/* Logo  */}
        <div className="flex w-max items-center gap-x-8">
          {" "}
          <div className="flex aspect-square items-center justify-center rounded-full border-2 border-black bg-white p-2">
            Logo
          </div>
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
    </div>
  );
};

export default HeaderA;

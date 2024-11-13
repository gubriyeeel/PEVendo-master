"use client";
import React, { useEffect, useState } from "react";
import { sendPostRequest } from "../../lib/localactions";

const Borrow = () => {
  // const [user, setUser] = useState<any>();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getUserData(15);
  //     setUser(data);
  //     console.log(data);
  //   };
  //   fetchData();
  // }, []);

  return (
    <div className="flex h-[75vh] w-full flex-col items-center justify-center gap-y-8">
      {/* <h1 className="text-2xl font-bold">Welcome {user?.name}</h1> */}
      <h1 className="text-2xl font-bold">Control the in-board button</h1>
      <span className="flex gap-x-10">
        <button
          onClick={async () => {
            console.log("FG, Clicked");
            await sendPostRequest("ON");
          }}
          className="rounded-xl bg-green-500 px-8 py-3 text-white"
        >
          ON
        </button>
        <button
          onClick={async () => {
            await sendPostRequest("OFF");
          }}
          className="rounded-xl bg-red-500 px-8 py-3 text-white"
        >
          OFF
        </button>
      </span>
    </div>
  );
};

export default Borrow;

"use client;";
import React from "react";
import RequestForm from "@/app/ui/datacomponents/RequestForm";

const page = async () => {
  return (
    <div className="flex min-h-[75vh] w-full items-center justify-center text-5xl">
      {/* Request Form with material type drop down and number of materials drop down */}
      <RequestForm />
    </div>
  );
};

export default page;

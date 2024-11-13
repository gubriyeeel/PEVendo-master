import React from "react";
import RequestDetails from "@/app/ui/datacomponents/RequestDetails";

const page = async ({ params }: { params: { id: number } }) => {
  return (
    <div className="my-11 flex min-h-[75vh] w-full flex-col items-center gap-y-3 text-center text-3xl">
      <h1 className="font-bold">Request of material details</h1>
      <RequestDetails id={params.id} />
    </div>
  );
};

export default page;

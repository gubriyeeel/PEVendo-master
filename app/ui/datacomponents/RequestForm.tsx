"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { getUserData, createRequest } from "@/app/lib/database/reqactions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const RequestForm = () => {
  type FormState = {
    materialType: string;
    materialNo: number;
  };

  type UserData = {
    name?: string;
    email: string;
    id?: string;
    studentId?: string;
  };

  const { toast } = useToast();
  const [formState, setFormState] = useState(null as FormState | null);
  const [materialType, setMaterialType] = useState("");
  const [materialNo, setMaterialNo] = useState("");
  const [userData, setUserData] = useState(null as UserData | null);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await getUserData();
      const filteredData: UserData = {
        name: data.user?.user_metadata.name,
        email: data.user!.email!,
        id: data.user?.id,
        studentId: data.user?.user_metadata.student_id,
      };
      setUserData(filteredData);

      if (error) {
        console.error("An error occurred while fetching user data.");
      }
    };
    fetchData();
  }, []);

  const materialNoOptions: string[] = ["1", "2", "3"];
  const materialTypeOptions: string[] = ["Shuttlecock", "Ping pong ball"];
  const disableSubmit: boolean =
    !materialNoOptions.includes(materialNo) ||
    !materialTypeOptions.includes(materialType);

  if (!formState) {
    return (
      <div className="my-8 flex min-h-[70vh] w-10/12 flex-col items-center justify-evenly border-black md:my-0 md:border-4">
        <h1 className="text-center text-5xl md:text-left">Request Materials</h1>
        <form className="mt-5 flex flex-col items-center gap-y-4 md:mt-0">
          {/* Material Type */}
          <div className="flex flex-col items-center justify-between gap-x-6 md:flex-row">
            <label className="text-xl">Material Type</label>
            <Select
              onValueChange={(e) => {
                setMaterialType(e);
              }}
            >
              <SelectTrigger className="w-[180px] rounded-box bg-gray-200 py-6">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {materialTypeOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="flex flex-col items-center justify-between gap-x-6 md:flex-row">
            <label className="text-xl">Quantity</label>
            <Select
              onValueChange={(e) => {
                setMaterialNo(e);
              }}
            >
              <SelectTrigger className="w-[180px] rounded-box bg-gray-200 py-6">
                <SelectValue placeholder="Select Quantity" />
              </SelectTrigger>
              <SelectContent>
                {materialNoOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            disabled={disableSubmit}
            className={`${disableSubmit ? "bg-gray-500" : "bg-red-500"} mt-3 w-52 rounded-xl py-3 text-xl text-white`}
            onClick={(e) => {
              e.preventDefault();
              if (
                materialType !== "Select Material Type" &&
                materialNo !== "Select Quantity"
              ) {
                setFormState({
                  materialType: materialType,
                  materialNo: Number(materialNo),
                });
              } else {
                alert(materialNo);
              }
            }}
          >
            Continue
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="my-8 flex min-h-[70vh] w-10/12 flex-col items-center justify-evenly border-black md:my-0 md:border-4">
        <h1 className="text-center text-5xl md:text-left">
          Requested Materials
        </h1>
        <div className="flex flex-col items-center gap-y-4">
          <h2 className="w-full text-center text-2xl font-bold">Details</h2>
          <div className="flex items-center justify-between gap-x-6">
            <label className="text-sm md:text-xl">Name</label>
            <p className="text-sm md:text-xl">
              {userData?.name ? userData.name : "noName"}
            </p>
          </div>
          <div className="flex items-center justify-between gap-x-6">
            <label className="text-sm md:text-xl">Email</label>
            <p className="text-sm md:text-xl">
              {userData!.email ? userData!.email : "noName"}
            </p>
          </div>
          <div className="flex items-center justify-between gap-x-6">
            <label className="text-sm md:text-xl">Student Id</label>
            <p className="text-sm md:text-xl">
              {userData!.studentId ? userData?.studentId : "Error"}
            </p>
          </div>
          <div className="flex items-center justify-between gap-x-6">
            <label className="text-sm md:text-xl">Material Type</label>
            <p className="text-sm md:text-xl">{formState.materialType}</p>
          </div>
          <div className="flex items-center justify-between gap-x-6">
            <label className="text-sm md:text-xl">Quantity</label>
            <p className="text-sm md:text-xl">{formState.materialNo}</p>
          </div>
          <div className="flex items-center justify-between gap-x-6">
            <label className="text-sm md:text-xl">Date</label>
            <p className="text-sm md:text-xl">
              {Date().toString().slice(0, 24)}
            </p>
          </div>
          <div className="flex flex-col gap-x-4 md:flex-row">
            <button
              className="mt-3 w-52 rounded-xl bg-gray-500 py-3 text-xl text-white"
              onClick={(e) => {
                e.preventDefault();
                setFormState(null);
              }}
            >
              Cancel
            </button>
            <button
              className="mt-3 w-52 rounded-xl bg-red-500 py-3 text-xl text-white"
              onClick={async (e) => {
                e.preventDefault();
                toast({
                  title: "Submitting request...",
                  description:
                    "Your request is being processed. You will be notified once it is approved.",
                });
                await createRequest(
                  formState.materialType,
                  formState.materialNo,
                  userData!.studentId!,
                  Date().toString().slice(0, 24),
                  "pending",
                );
              }}
            >
              Submit
            </button>
          </div>
        </div>{" "}
      </div>
    );
  }
};
export default RequestForm;

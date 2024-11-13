"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  getUniformByID,
  changeRequestStatus,
} from "@/app/lib/database/transactions";
import { set } from "zod";
import { redirect } from "next/navigation";
import Link from "next/link";

type UniformwithUser = {
  id?: number;
  dateTime?: string;
  status?: string;
  materialType?: string;
  materialNo?: number;
  studentID?: number;
  Users?: {
    id?: number;
    name?: string;
    email?: string;
  };
};

const UniformDetails = ({ id }: { id: number }) => {
  const [request, setRequest] = useState<UniformwithUser>({});

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await getUniformByID(id);
      //   data![0].dateTime = new Date(data![0].dateTime).toLocaleString();
      setRequest(data![0] as UniformwithUser);
      if (error) {
        console.error("An error occurred while fetching transactions.");
      }
    };
    fetchRequests();
  }, [id]);

  return (
    <div className="flex w-full flex-col items-center gap-y-5 md:w-5/12">
      {/* Name */}
      <div className="flex w-10/12 flex-wrap text-left">
        <h3 className="w-2/5 text-sm font-bold md:text-xl">Name:</h3>
        <p className="w-3/5 text-sm md:text-xl">{request.Users?.name}</p>
      </div>
      {/* Email */}
      <div className="flex w-10/12 flex-wrap text-left">
        <h3 className="w-2/5 text-sm font-bold md:text-xl">Email:</h3>
        <p className="w-3/5 text-sm md:text-xl">{request.Users?.email}</p>
      </div>
      {/* Material */}
      <div className="flex w-10/12 flex-wrap text-left">
        <h3 className="w-2/5 text-sm font-bold md:text-xl">Material Type:</h3>
        <p className="w-3/5 text-sm md:text-xl">{request.materialType}</p>
      </div>
      <div className="flex w-10/12 flex-wrap text-left">
        <h3 className="w-2/5 text-sm font-bold md:text-xl">Quantity :</h3>
        <p className="w-3/5 text-sm md:text-xl">{request.materialNo}</p>
      </div>
      {/* Date */}
      <div className="flex w-10/12 flex-wrap text-left">
        <h3 className="w-2/5 text-sm font-bold md:text-xl">Date:</h3>
        <p className="w-3/5 text-sm md:text-xl">{request.dateTime}</p>
      </div>
      {/* Status */}
      <div className="flex w-10/12 flex-wrap text-left">
        <h3 className="w-2/5 text-sm font-bold md:text-xl">Status:</h3>
        <p className="w-3/5 text-sm md:text-xl">{request.status}</p>
      </div>
      {/* Buttons */}
      {request.status === "pending" && (
        <div className="flex w-10/12 flex-wrap gap-y-5 text-left">
          <button
            onClick={() => {
              changeRequestStatus(id, "declined");
            }}
            className="w-full rounded-md bg-gray-500 px-2 py-1 text-white"
          >
            Decline
          </button>
          <button
            onClick={() => {
              changeRequestStatus(id, "approved");
            }}
            className="w-full rounded-md bg-red-500 px-2 py-1 text-white"
          >
            Approve
          </button>
        </div>
      )}
      {request.status === "declined" && (
        <div className="flex w-10/12 flex-wrap gap-y-5 text-left">
          <Link
            href={`/request`}
            className="w-full rounded-md bg-gray-500 px-2 py-1 text-center text-white"
          >
            Cancel
          </Link>
          <button
            onClick={() => {
              changeRequestStatus(id, "approved");
            }}
            className="w-full rounded-md bg-red-500 px-2 py-1 text-white"
          >
            Approve
          </button>
        </div>
      )}
      {request.status === "approved" && (
        <div className="flex w-10/12 flex-wrap gap-y-5 text-left">
          <Link
            href={`/request`}
            className="w-full rounded-md bg-gray-500 px-2 py-1 text-center text-white"
          >
            Cancel
          </Link>
          <button
            onClick={() => {
              changeRequestStatus(id, "declined");
            }}
            className="w-full rounded-md bg-red-500 px-2 py-1 text-white"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default UniformDetails;

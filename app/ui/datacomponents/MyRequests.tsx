"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getMyRequests, getMyUniforms } from "@/app/lib/database/transactions";

type Request = {
  id: number;
  dateTime: string;
  status: string;
};

const MyTransactions = ({ studentNumber }: { studentNumber: string }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await getMyRequests(studentNumber);
      data?.forEach((entry) => {
        entry.dateTime = new Date(entry.dateTime).toLocaleString();
        if (entry.status === "pending") {
          entry.status = "pending";
        }
      });
      setRequests(data as Request[]);
      if (error) {
        console.error("An error occurred while fetching transactions.");
      }
    };
    fetchRequests();
  }, [studentNumber]);

  return (
    <div className="flex w-full flex-col items-center md:overflow-y-scroll">
      <div className="flex w-full bg-gray-500 text-sm text-white">
        <h3 className="hidden w-1/4 text-2xl md:block">Transaction Type</h3>
        <h3 className="hidden w-1/4 text-2xl md:block">Transaction ID</h3>
        <h3 className="hidden w-1/4 text-2xl md:block">Transaction Date</h3>
        <h3 className="hidden w-1/4 text-2xl md:block">Transaction Status</h3>
        <h3 className="w-1/4 md:hidden"> Type</h3>
        <h3 className="w-1/4 md:hidden"> ID</h3>
        <h3 className="w-1/4 md:hidden"> Date</h3>
        <h3 className="w-1/4 md:hidden"> Status</h3>
      </div>
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex w-full border-b-2 border-black bg-gray-300 py-2 text-sm md:text-2xl"
        >
          <p className="w-1/4">Request</p>
          <p className="w-1/4">{request.id}</p>
          <p className="w-1/4">{request.dateTime}</p>
          <p className="w-1/4">{request.status}</p>
        </div>
      ))}
    </div>
  );
};

export default MyTransactions;

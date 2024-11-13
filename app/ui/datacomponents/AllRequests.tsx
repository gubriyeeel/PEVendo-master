"use client";
import React from "react";
import { useEffect, useState } from "react";

import moment from "moment";
import { Requests, getFilteredRequests } from "@/app/lib/prisma/admin/queries";
import { changeRequestStatus } from "@/app/lib/database/transactions";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";

const AllRequests = () => {
  const [requests, setRequests] = useState<Requests[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Requests>();
  const [debouncedValue, setDebouncedValue] = useState(searchText);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setRequests([]);

    const handler = setTimeout(() => {
      setDebouncedValue(searchText);
    }, 1000); // 1000ms = 1 second

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // Fetch All Requests
  useEffect(() => {
    const searchText = debouncedValue;
    const fetchRequests = async () => {
      const { data, count } = await getFilteredRequests({ searchText, page });
      setRequests(data);
      setCount(count);
    };
    fetchRequests();
  }, [debouncedValue, page]);

  return (
    <div className="flex w-full flex-col items-center md:overflow-y-scroll">
      {/* Filters */}
      <div className="flex min-h-[10vh] w-full p-8 text-sm text-black">
        {/* Search bar */}
        <input
          placeholder="Search"
          value={searchText}
          onChange={handleChange}
          className="w-full md:w-1/4"
        ></input>
      </div>
      {/* Table Header */}
      <div className="flex w-full bg-gray-500 text-sm text-white">
        <h3 className="hidden w-1/4 text-2xl md:block">User</h3>
        <h3 className="hidden w-1/4 text-2xl md:block">Transaction ID</h3>
        <h3 className="hidden w-1/4 text-2xl md:block">Transaction Date</h3>
        <h3 className="hidden w-1/4 text-2xl md:block">Transaction Status</h3>
        <h3 className="w-1/4 md:hidden"> User</h3>
        <h3 className="w-1/4 md:hidden"> ID</h3>
        <h3 className="w-1/4 md:hidden"> Date</h3>
        <h3 className="w-1/4 md:hidden"> Status</h3>
      </div>
      {/* Table Body */}
      {requests.map((request) => (
        <div key={request.id} className="flex w-full flex-col">
          <div
            onClick={() => {
              if (selectedRequest === request) {
                setSelectedRequest(undefined);
              } else {
                setSelectedRequest(request);
              }
            }}
            className="flex w-full border-b-2 border-black bg-gray-300 py-2 text-sm md:text-2xl"
          >
            <p className="w-1/4">{request?.Users?.name.toUpperCase()}</p>
            <p className="w-1/4">{request.id}</p>
            <p className="w-1/4">{moment(request.dateTime).format("LLL")}</p>
            <p className="w-1/4">{request.status}</p>
          </div>
          {selectedRequest === request && (
            <div className="flex w-full justify-center border-b-2 border-black bg-gray-100 py-12 text-sm md:text-2xl">
              <div className="flex w-full flex-col items-center gap-y-5 md:w-5/12">
                {/* Name */}
                <div className="flex w-10/12 flex-wrap text-left">
                  <h3 className="w-1/2 text-sm font-bold md:text-xl">Name:</h3>
                  <p className="w-1/2 text-sm md:text-xl">
                    {request.Users?.name}
                  </p>
                </div>
                {/* Email */}
                <div className="flex w-10/12 flex-wrap text-left">
                  <h3 className="w-1/2 text-sm font-bold md:text-xl">Email:</h3>
                  <p className="w-1/2 text-sm md:text-xl">
                    {request.Users?.email}
                  </p>
                </div>
                {/* Material */}
                <div className="flex w-10/12 flex-wrap text-left">
                  <h3 className="w-1/2 text-sm font-bold md:text-xl">
                    Material Type:
                  </h3>
                  <p className="w-1/2 text-sm md:text-xl">
                    {request.materialType}
                  </p>
                </div>
                <div className="flex w-10/12 flex-wrap text-left">
                  <h3 className="w-1/2 text-sm font-bold md:text-xl">
                    Quantity :
                  </h3>
                  <p className="w-1/2 text-sm md:text-xl">
                    {request.materialNo}
                  </p>
                </div>
                {/* Status */}
                <div className="flex w-10/12 flex-wrap text-left">
                  <h3 className="w-1/2 text-sm font-bold md:text-xl">
                    Status:
                  </h3>
                  <p className="w-1/2 text-sm md:text-xl">{request.status}</p>
                </div>
                {/* Buttons */}
                {request.status === "pending" && (
                  <div className="flex w-10/12 flex-wrap gap-y-5 text-left">
                    <button
                      onClick={async () => {
                        await changeRequestStatus(
                          Number(request.id),
                          "declined",
                        );
                        toast({
                          title: "Request Declined",
                          description: "The request has been declined.",
                          variant: "default",
                          duration: 3000,
                        });
                      }}
                      className="w-full rounded-md bg-gray-500 px-2 py-1 text-white"
                    >
                      Decline
                    </button>
                    <button
                      onClick={async () => {
                        await changeRequestStatus(
                          Number(request.id),
                          "approved",
                        );
                        toast({
                          title: "Request Approved",
                          description: "The request has been approved.",
                          variant: "default",
                          duration: 3000,
                        });
                      }}
                      className="w-full rounded-md bg-red-500 px-2 py-1 text-white"
                    >
                      Approve
                    </button>
                  </div>
                )}
                {/* {request.status === "declined" && (
                  <div className="flex w-10/12 flex-wrap gap-y-5 text-left">
                    <button
                      onClick={() => {
                        changeRequestStatus(Number(request.id), "approved");
                      }}
                      className="w-full rounded-md bg-red-500 px-2 py-1 text-white"
                    >
                      Approve
                    </button>
                  </div>
                )}
                {request.status === "approved" && (
                  <div className="flex w-10/12 flex-wrap gap-y-5 text-left">
                    <button
                      onClick={() => {
                        changeRequestStatus(Number(request.id), "declined");
                      }}
                      className="w-full rounded-md bg-red-500 px-2 py-1 text-white"
                    >
                      Decline
                    </button>
                  </div>
                )} */}
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Pagination */}
      <Pagination className="mt-auto justify-self-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (page > 1) {
                  setIsLoading(true);
                  setPage(page - 1);
                }
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              onClick={() => {
                setIsLoading(true);
                setPage(1);
              }}
              isActive={page === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className={count > 20 ? "" : "hidden"}
              onClick={() => {
                setIsLoading(true);
                setPage(2);
              }}
              isActive={page === 2}
            >
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className={count > 40 ? "" : "hidden"}
              onClick={() => {
                setIsLoading(true);
                setPage(3);
              }}
              isActive={page === 3}
            >
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className={count > 60 ? "" : "hidden"}
              onClick={() => {
                setIsLoading(true);
                setPage(4);
              }}
              isActive={page === 4}
            >
              4
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (page < count / 6) {
                  setIsLoading(true);
                  setPage(page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AllRequests;

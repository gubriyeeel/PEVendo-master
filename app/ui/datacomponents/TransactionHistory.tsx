"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getMyTransactions } from "@/app/lib/prisma/student/queries";
import moment, { Moment } from "moment";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const TransactionHistory = ({ studentNumber }: { studentNumber: string }) => {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [myTransactions, setMyTransactions] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    const success = searchParams.get("success");
    if (success) {
      toast({
        description: "Transaction done successfully",
        title: "Success",
        duration: 4000,
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const { pageData, count } = await getMyTransactions(
        studentNumber,
        page,
        date,
      );

      setCount(count);
      setMyTransactions(pageData);
      setIsLoading(false);
    };
    fetchData();
  }, [studentNumber, page, date]);

  const getStatusColor = (status: any) => {
    switch (status) {
      case "pending":
        return "text-green-500";
      case "declined":
        return "text-red-500";
      case "approved":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusDot = (status: any) => {
    const baseClasses = "inline-block w-2 h-2 rounded-full mr-2";
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-500`;
      case "declined":
        return `${baseClasses} bg-red-500`;
      case "pending":
        return `${baseClasses} bg-green-500`;
      default:
        return `${baseClasses} bg-gray-500`;
    }
  };

  const handleSelect = (selectedDate: any) => {
    setPage(1);
    setDate(selectedDate);
    setPopoverOpen(false); // Close the popover when a date is selected
  };

  return (
    <Card className="flex h-[80vh] w-[90vw] max-w-4xl flex-col justify-between md:w-[70vw]">
      <div>
        <CardHeader>
          <CardTitle className="w-full border-b border-red-500 pb-2 text-3xl font-bold">
            Transaction History
          </CardTitle>
        </CardHeader>
        {isLoading ? (
          <div className="flex h-96 w-full items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          <CardContent className="flex h-full flex-col justify-between">
            <div className="relative overflow-x-auto">
              <table className="w-full text-center text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Transaction ID</th>
                    <th className="px-6 py-3 font-semibold">
                      Transaction Type
                    </th>
                    <th className="flex justify-center px-6 py-3 font-semibold">
                      Transaction Date
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Filter className="ml-2 h-4 w-4" />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </th>
                    <th className="px-6 py-3 text-center font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                {isLoading === false && (
                  <tbody>
                    {myTransactions.map((transaction, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          transaction.status === "Declined"
                            ? "bg-red-50"
                            : "bg-white"
                        }`}
                      >
                        <td className="px-6 py-4">{transaction.id}</td>
                        <td className="px-6 py-4">{transaction.type}</td>
                        <td className="px-6 py-4">
                          {moment(transaction.dateTime).format("DD MMM YYYY")}
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center justify-center">
                            <span
                              className={getStatusDot(transaction.status)}
                            ></span>
                            <span
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </CardContent>
        )}
      </div>
      <CardFooter>
        <Pagination className="mt-4 justify-self-end">
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
                className={count > 6 ? "" : "hidden"}
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
                className={count > 12 ? "" : "hidden"}
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
                className={count > 18 ? "" : "hidden"}
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
      </CardFooter>
    </Card>
  );
};

export default TransactionHistory;

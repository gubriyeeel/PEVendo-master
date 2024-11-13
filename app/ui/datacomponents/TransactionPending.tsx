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
import { getPendingTransactions } from "@/app/lib/prisma/student/queries";
import moment, { Moment } from "moment";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";

const TransactionHistory = ({ studentNumber }: { studentNumber: string }) => {
  const [myTransactions, setMyTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const { pageData, error } = await getPendingTransactions(
        studentNumber,
        page,
        date,
      );

      if (error) {
        console.error("An error occurred while fetching transactions.");
      }
      setMyTransactions(pageData);
      setIsLoading(false);
    };
    fetchData();
  }, [studentNumber, page, date]);

  const handleSelect = (selectedDate: any) => {
    setPage(1);
    setDate(selectedDate);
    setPopoverOpen(false); // Close the popover when a date is selected
  };

  return (
    <Card className="flex h-[80vh] w-[90vw] max-w-4xl flex-col justify-between md:w-[40vw]">
      <div>
        <CardHeader>
          <CardTitle className="w-full border-b border-red-500 pb-2 text-3xl font-bold">
            Pending Transactions
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
                    <th className="flex px-6 py-3 font-semibold">
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
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </CardContent>
        )}
      </div>
    </Card>
  );
};

export default TransactionHistory;

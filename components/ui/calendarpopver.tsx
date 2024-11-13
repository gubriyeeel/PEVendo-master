"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";

const DatePickerButton = ({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: React.Dispatch<Date | undefined>;
}) => {
  const formatDate = (date: any) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Filter className="ml-2 h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(newDate) => setDate(newDate)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerButton;

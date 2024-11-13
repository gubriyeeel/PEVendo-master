"use client";
// TODO: Finish Setting up
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import { getUserData, createOrder } from "@/app/lib/database/uniactions";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import short from "@/public/Short.png";
import shirt from "@/public/Shirt.png";
import pants from "@/public/Jogging Pants.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { set } from "zod";

type FormState = {
  topSize: string;
  topQuantity: number;
  pantsSize: string;
  pantsQuantity: number;
  shortsSize: string;
  shortsQuantity: number;
};

type UserData = {
  name?: string;
  email: string;
  id?: string;
  studentId?: string;
};

const UniformForm = () => {
  const sizeOptions = [
    "Extra Small",
    "Small",
    "Medium",
    "Large",
    "Extra Large",
    "Extra Extra Large",
    "No Order",
  ];
  const quantityOptions = ["0", "1", "2", "3", "4", "5"];
  const carouselOptions = [short, shirt, pants];

  const { toast } = useToast();
  const [final, setFinal] = useState(false);
  const [formState, setFormState] = useState(null as FormState | null);
  const [topSize, setTopSize] = useState("Select Top Size");
  const [topQuantity, setTopQuantity] = useState("Select Top Quantity");
  const [pantsSize, setPantsSize] = useState("Select Pants Size");
  const [pantsQuantity, setPantsQuantity] = useState("Select Pants Quantity");
  const [shortsSize, setShortsSize] = useState("Select Short Size");
  const [shortsQuantity, setShortsQuantity] = useState("Select Short Quantity");
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

  const disableSubmit: boolean =
    !quantityOptions.includes(topQuantity) ||
    !quantityOptions.includes(pantsQuantity) ||
    !quantityOptions.includes(shortsQuantity) ||
    !sizeOptions.includes(topSize) ||
    !sizeOptions.includes(pantsSize) ||
    !sizeOptions.includes(shortsSize) ||
    (topQuantity === "0" && topSize !== "No Order") ||
    (pantsQuantity === "0" && pantsSize !== "No Order") ||
    (shortsQuantity === "0" && shortsSize !== "No Order") ||
    (topQuantity !== "0" && topSize === "No Order") ||
    (pantsQuantity !== "0" && pantsSize === "No Order") ||
    (shortsQuantity !== "0" && shortsSize === "No Order") ||
    (topQuantity === "0" && pantsQuantity === "0" && shortsQuantity === "0");

  if (!formState) {
    return (
      <div className="mb-8 flex min-h-[90%] w-10/12 flex-col items-center border-black md:my-0 md:flex-row md:border-4">
        <div className="order-2 flex h-full w-10/12 flex-col items-center justify-evenly text-center md:order-1 md:w-5/12 md:text-left">
          <Carousel className="order-2 aspect-square w-full md:order-1 md:w-9/12">
            <CarouselContent>
              {carouselOptions.map((image, index) => (
                <CarouselItem key={index}>
                  <Image src={image} alt="uniform" width={500} height={500} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <h2 className="order-1 text-3xl md:order-2">Conversion Chart</h2>
        </div>
        <div className="order-1 flex h-full w-11/12 flex-col items-center justify-evenly gap-y-3 py-4 md:order-2 md:w-7/12 md:border-l-4 md:border-black">
          <h1 className="text-center text-4xl font-bold md:text-left md:text-3xl">
            Ordering PE Uniform
          </h1>
          {/* Divider */}
          <div className="flex h-[10%] w-full items-center justify-center bg-gray-500 text-3xl md:p-3 md:text-left">
            TOP
          </div>
          {/* TOP */}
          <div className="flex w-full flex-col items-center justify-evenly md:flex-row">
            {/* Size */}
            <div className="flex flex-col items-center justify-between gap-x-6 md:flex-row">
              <label className="text-xl">Top</label>
              <Select
                onValueChange={(e) => {
                  setTopSize(e);
                }}
              >
                <SelectTrigger className="w-[180px] rounded-box bg-gray-200 py-6">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Quantity */}
            <div className="flex flex-col items-center justify-between gap-x-6 md:flex-row">
              <Select
                onValueChange={(e) => {
                  setTopQuantity(e);
                }}
              >
                <SelectTrigger className="w-[180px] rounded-box bg-gray-200 py-6">
                  <SelectValue placeholder="Select Quantity" />
                </SelectTrigger>
                <SelectContent>
                  {quantityOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Divider */}
          <div className="flex h-[10%] w-full items-center justify-center bg-gray-500 text-3xl md:p-3 md:text-left">
            Bottom
          </div>
          {/* Shorts */}
          <div className="flex w-full flex-col items-center justify-evenly md:flex-row">
            {/* Size */}
            <div className="flex flex-col items-center justify-between gap-x-6 md:flex-row">
              <label className="text-xl">Shorts</label>
              <Select
                onValueChange={(e) => {
                  setShortsSize(e);
                }}
              >
                <SelectTrigger className="w-[180px] rounded-box bg-gray-200 py-6">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Quantity */}
            <div className="flex flex-col items-center justify-between gap-x-6 md:flex-row">
              <Select
                onValueChange={(e) => {
                  setShortsQuantity(e);
                }}
              >
                <SelectTrigger className="w-[180px] rounded-box bg-gray-200 py-6">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  {quantityOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Pants */}
          <div className="flex w-full flex-col items-center justify-evenly md:flex-row">
            {/* Size */}
            <div className="flex flex-col items-center justify-between gap-x-6 md:flex-row">
              <label className="text-xl">Pants</label>
              <Select
                onValueChange={(e) => {
                  setPantsSize(e);
                }}
              >
                <SelectTrigger className="w-[180px] rounded-box bg-gray-200 py-6">
                  <SelectValue placeholder="Set Size" />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Quantity */}
            <div className="flex flex-col items-center justify-between gap-x-6 md:flex-row">
              <Select
                onValueChange={(e) => {
                  setPantsQuantity(e);
                }}
              >
                <SelectTrigger className="w-[180px] rounded-box bg-gray-200 py-6">
                  <SelectValue placeholder="Select Quantity" />
                </SelectTrigger>
                <SelectContent>
                  {quantityOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SubmitButton */}
          <button
            disabled={disableSubmit}
            className={`mt-3 w-52 rounded-xl py-3 text-xl text-white ${disableSubmit ? `bg-gray-500` : "bg-red-500"}`}
            onClick={(e) => {
              e.preventDefault();

              setFormState({
                topSize: topSize,
                topQuantity: Number(topQuantity),
                shortsSize: shortsSize,
                shortsQuantity: Number(shortsQuantity),
                pantsSize: pantsSize,
                pantsQuantity: Number(pantsQuantity),
              });
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  } else {
    if (!final) {
      return (
        <div className="my-8 flex min-h-[85%] w-10/12 flex-col items-center justify-evenly md:my-0 md:border-4 md:border-black md:py-28">
          <h1 className="text-center text-4xl font-bold md:text-left md:text-3xl">
            Ordering PE Uniform
          </h1>
          <div className="flex h-full w-full flex-col items-center justify-evenly">
            {/* Table */}
            <div className="flex h-[80%] w-full flex-col md:w-9/12 md:flex-row">
              {/* Top */}
              <div className="flex h-full w-full flex-col border-4 border-black md:w-1/2">
                <div className="flex h-[25%] w-full flex-col items-center justify-center bg-gray-500 text-3xl md:p-3">
                  TOP
                </div>
                <div className="flex h-[75%] w-full flex-col items-center justify-evenly">
                  <div className="flex w-full flex-col items-center justify-evenly py-5 md:py-0">
                    <div className="flex justify-between gap-x-6">
                      <div className="text-xl md:text-2xl">
                        Size: {formState.topSize}
                      </div>
                    </div>
                    <div className="flex justify-between gap-x-6">
                      <div className="text-xl md:text-2xl">
                        Quantity: {formState.topQuantity}
                      </div>
                    </div>
                    <div className="flex justify-between gap-x-6">
                      <div className="text-xl md:text-2xl">
                        Price: {`₱` + Number(formState.topQuantity) * 390}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Shorts */}
              <div className="flex h-full w-full flex-col border-4 border-black md:w-1/2">
                <div className="flex h-[25%] w-full flex-col items-center justify-center bg-gray-500 text-3xl md:p-3">
                  SHORTS
                </div>
                <div className="flex h-[75%] w-full flex-col items-center justify-evenly">
                  <div className="flex w-full flex-col items-center justify-evenly py-5 md:py-0">
                    <div className="flex justify-between gap-x-6">
                      <div className="text-xl md:text-2xl">
                        Size: {formState.shortsSize}
                      </div>
                    </div>
                    <div className="flex justify-between gap-x-6">
                      <div className="text-xl md:text-2xl">
                        Quantity: {formState.shortsQuantity}
                      </div>
                    </div>
                    <div className="flex justify-between gap-x-6">
                      <div className="text-xl md:text-2xl">
                        Price: {`₱` + Number(formState.shortsQuantity) * 375}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Pants */}
              <div className="flex h-full w-full flex-col border-4 border-black md:w-1/2">
                <div className="flex h-[25%] w-full flex-col items-center justify-center bg-gray-500 text-3xl md:p-3">
                  PANTS
                </div>
                <div className="flex h-[75%] w-full flex-col items-center justify-evenly">
                  <div className="flex w-full flex-col items-center justify-evenly py-5 md:py-0">
                    <div className="flex justify-between gap-x-6">
                      <div className="text-xl md:text-2xl">
                        Size: {formState.pantsSize}
                      </div>
                    </div>
                    <div className="flex justify-between gap-x-6">
                      <div className="text-xl md:text-2xl">
                        Quantity: {formState.pantsQuantity}
                      </div>
                    </div>
                    <div className="flex justify-between gap-x-6">
                      <div className="text-xl md:text-2xl">
                        Price: {`₱` + Number(formState.pantsQuantity) * 450}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}

            <div className="mt-10 flex w-full flex-col items-center justify-center text-3xl font-bold md:text-2xl">
              Total:{" ₱"}
              {Number(formState.topQuantity) * 390 +
                Number(formState.shortsQuantity) * 375 +
                Number(formState.pantsQuantity) * 450}
            </div>

            {/* Buttons */}
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
                    title: "Submitting Order",
                    description: "Please wait...",
                    duration: 3000,
                  });
                  await createOrder(
                    formState.topSize,
                    formState.topQuantity,
                    formState.pantsSize,
                    formState.pantsQuantity,
                    formState.shortsSize,
                    formState.shortsQuantity,
                    userData!.studentId!,
                    Date().toString().slice(0, 24),
                    "pending",
                  );
                  toast({
                    title: "Order Submitted",
                    description:
                      "Remember to keep this receipt for your records",
                    duration: 3000,
                  });

                  setFinal(true);
                }}
              >
                Confirm
              </button>
            </div>
          </div>{" "}
        </div>
      );
    } else {
      return (
        <div className="my-8 flex min-h-[85%] w-11/12 flex-col items-center justify-evenly text-black md:my-0">
          <div className="flex h-full w-full flex-col items-center justify-end md:flex-row">
            {/* Info Part */}
            <div className="order-2 flex h-full w-full flex-col justify-between gap-x-4 p-4 text-2xl md:order-1 md:w-5/12">
              <div>
                <p className="text-center font-bold md:mt-10">
                  <strong className="text-red-500">Note:</strong> Show this
                  receipt to the DPECS to claim your order
                </p>
              </div>
              {/* Buttons */}
              <div className="flex w-full flex-col justify-evenly gap-x-4 md:flex-row">
                <button
                  className="mt-3 w-full rounded-xl bg-red-500 py-3 text-xl text-white md:w-52"
                  onClick={async (e) => {
                    e.preventDefault();
                  }}
                >
                  Download
                </button>
              </div>
            </div>
            {/* Reciept */}
            <div className="flex h-full w-full flex-col items-center justify-evenly gap-y-2 border-4 border-black py-5 md:w-7/12 md:py-0">
              <h2 className="text-2xl font-bold">Reference Number</h2>
              <h1 className="text-4xl font-bold md:text-7xl">PE-0001</h1>
              <h2 className="text-2xl font-bold">Details</h2>
              <div className="flex items-center justify-between gap-x-6">
                <label className="text-xs md:text-xl">Name: </label>
                <p className="text-xs md:text-xl">
                  {userData?.name ? userData.name : "noName"}
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-6">
                <label className="text-xs md:text-xl">Amount to Pay: </label>
                <p className="text-xs md:text-xl">
                  ₱
                  {Number(formState.topQuantity) * 390 +
                    Number(formState.shortsQuantity) * 375 +
                    Number(formState.pantsQuantity) * 450}
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-6">
                <label className="text-xs md:text-xl">Email: </label>
                <p className="text-xs md:text-xl">
                  {userData?.email ? userData.email : "noName"}
                </p>
              </div>
              <div className="flex items-center justify-between gap-x-6">
                <label className="text-xs md:text-xl">Date and time</label>
                <p className="text-xs md:text-xl">
                  {Date().toString().slice(0, 24)}
                </p>
              </div>
              <div className="flex h-[30%] w-full">
                {/* Top */}
                <div className="flex h-full w-1/2 flex-col">
                  <div className="flex w-full flex-col items-center justify-center border-y-2 border-black py-2 text-xl font-bold">
                    TOP
                  </div>
                  <div className="flex h-[75%] w-full flex-col items-center justify-evenly">
                    <div className="flex w-full flex-col items-center justify-evenly">
                      <div className="flex justify-between gap-x-6">
                        <div className="text-base md:text-2xl">
                          Size: {formState.topSize}
                        </div>
                      </div>
                      <div className="flex justify-between gap-x-6">
                        <div className="text-base md:text-2xl">
                          Quantity: {formState.topQuantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Shorts */}
                <div className="flex h-full w-1/2 flex-col">
                  <div className="flex w-full flex-col items-center justify-center border-y-2 border-black py-2 text-xl font-bold">
                    SHORTS
                  </div>
                  <div className="flex h-[75%] w-full flex-col items-center justify-evenly">
                    <div className="flex w-full flex-col items-center justify-evenly">
                      <div className="flex justify-between gap-x-6">
                        <div className="text-base md:text-2xl">
                          Size: {formState.shortsSize}
                        </div>
                      </div>
                      <div className="flex justify-between gap-x-6">
                        <div className="text-base md:text-2xl">
                          Quantity: {formState.shortsQuantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pants */}
                <div className="flex h-full w-1/2 flex-col">
                  <div className="flex w-full flex-col items-center justify-center border-y-2 border-black py-2 text-xl font-bold">
                    PANTS
                  </div>
                  <div className="flex h-[75%] w-full flex-col items-center justify-evenly">
                    <div className="flex w-full flex-col items-center justify-evenly">
                      <div className="flex justify-between gap-x-6">
                        <div className="text-base md:text-2xl">
                          Size: {formState.pantsSize}
                        </div>
                      </div>
                      <div className="flex justify-between gap-x-6">
                        <div className="text-base md:text-2xl">
                          Quantity: {formState.pantsQuantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
      );
    }
  }
};
export default UniformForm;

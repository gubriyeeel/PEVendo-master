"use server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { equal } from "assert";
import moment from "moment";

export const getMyTransactions = async (
  studentNumber: string,
  page: number,
  date?: Date,
) => {
  const formatFilter1: Prisma.UniformWhereInput = {
    studentID: studentNumber,
    status: { in: ["approved", "declined"] },
  };

  const formatFilter2: Prisma.RequestsWhereInput = {
    studentID: studentNumber,
    status: { in: ["approved", "declined"] },
  };

  if (date) {
    const endDate = moment(date).add(1, "days").toDate();
    formatFilter1.dateTime = {
      gte: date,
      lte: endDate,
    };

    formatFilter2.dateTime = {
      gte: date,
      lte: endDate,
    };
  }

  const requestsData = await prisma.requests.findMany({
    where: formatFilter2,
    orderBy: {
      dateTime: "desc",
    },
  });

  const uniformsData = await prisma.uniform.findMany({
    where: formatFilter1,
    orderBy: {
      dateTime: "desc",
    },
  });

  //   Append type to each item in uniformsData
  const uniforms = uniformsData.map((item) => ({ ...item, type: "Uniform" }));
  const requests = requestsData.map((item) => ({
    ...item,
    type: "Request",
  }));

  //   Combine requestsData and uniformsData into a single array
  const data = [...uniforms, ...requests];

  //   Sort the combined array by dateTime
  data.sort((a, b) => {
    return (
      new Date(b.dateTime as Date).getTime() -
      new Date(a.dateTime as Date).getTime()
    );
  });

  //   Slice the array to get the requested page of data
  const startIndex = (page - 1) * 6;
  const endIndex = startIndex + 6;
  const pageData = data.slice(startIndex, endIndex);

  return { pageData, count: data.length };
};

export const getPendingTransactions = async (
  studentNumber: string,
  page: number,
  date?: Date,
) => {
  const formatFilter1: Prisma.UniformWhereInput = {
    studentID: studentNumber,
    status: "pending",
  };

  const formatFilter2: Prisma.RequestsWhereInput = {
    studentID: studentNumber,
    status: "pending",
  };

  if (date) {
    const endDate = moment(date).add(1, "days").toDate();
    formatFilter1.dateTime = {
      gte: date,
      lte: endDate,
    };

    formatFilter2.dateTime = {
      gte: date,
      lte: endDate,
    };
  }

  const requestsData = await prisma.requests.findMany({
    where: formatFilter2,
    orderBy: {
      dateTime: "desc",
    },
  });

  const uniformsData = await prisma.uniform.findMany({
    where: formatFilter1,
    orderBy: {
      dateTime: "desc",
    },
  });

  //   Append type to each item in uniformsData
  const uniforms = uniformsData.map((item) => ({ ...item, type: "Uniform" }));
  const requests = requestsData.map((item) => ({
    ...item,
    type: "Request",
  }));

  //   Combine requestsData and uniformsData into a single array
  const data = [...uniforms, ...requests];

  //   Sort the combined array by dateTime
  data.sort((a, b) => {
    return (
      new Date(b.dateTime as Date).getTime() -
      new Date(a.dateTime as Date).getTime()
    );
  });

  //   Slice the array to get the requested page of data
  const startIndex = (page - 1) * 6;
  const endIndex = startIndex + 6;
  const pageData = data.slice(startIndex, endIndex);

  return { pageData, error: null };
};

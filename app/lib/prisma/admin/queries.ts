"use server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export type Requests = Prisma.RequestsGetPayload<{
  include: {
    Users: true;
  };
}>;

export type Uniforms = Prisma.UniformGetPayload<{
  include: {
    Users: true;
  };
}>;

export const getFilteredRequests = async ({
  searchText,
  page,
}: {
  searchText?: string;
  page: number;
}) => {
  const formatFilter: Prisma.RequestsWhereInput = {};

  if (searchText) {
    formatFilter.OR = [
      { studentID: { contains: searchText, mode: "insensitive" } },
      { materialType: { contains: searchText, mode: "insensitive" } },
      { status: { contains: searchText, mode: "insensitive" } },
      { Users: { name: { contains: searchText, mode: "insensitive" } } },
      { Users: { email: { contains: searchText, mode: "insensitive" } } },
      { Users: { course: { contains: searchText, mode: "insensitive" } } },
    ];
  }

  const data = await prisma.requests.findMany({
    where: formatFilter,
    include: {
      Users: true,
    },
    orderBy: {
      dateTime: "desc",
    },
    take: 20,
    skip: (page - 1) * 20,
  });

  const count = await prisma.requests.count({
    where: formatFilter,
  });
  return { data, count };
};

export const getFilteredUniforms = async ({
  searchText,
  page,
}: {
  searchText?: string;
  page: number;
}) => {
  const formatFilter: Prisma.UniformWhereInput = {};

  if (searchText) {
    formatFilter.OR = [
      { studentID: { contains: searchText, mode: "insensitive" } },
      { status: { contains: searchText, mode: "insensitive" } },
      { Users: { name: { contains: searchText, mode: "insensitive" } } },
      { Users: { email: { contains: searchText, mode: "insensitive" } } },
      { Users: { course: { contains: searchText, mode: "insensitive" } } },
    ];
  }

  const data = await prisma.uniform.findMany({
    where: formatFilter,
    include: {
      Users: true,
    },
    orderBy: {
      dateTime: "desc",
    },
    take: 20,
    skip: (page - 1) * 20,
  });

  const count = await prisma.uniform.count({
    where: formatFilter,
  });
  return { data, count };
};

export const getPendingRequestCount = async () => {
  const data = await prisma.requests.count({
    where: {
      status: "pending",
    },
  });
  return data;
};

export const getPendingUniformCount = async () => {
  const data = await prisma.uniform.count({
    where: {
      status: "pending",
    },
  });
  return data;
};

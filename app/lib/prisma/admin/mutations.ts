"use server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export const updateUniformStatus = async (id: number, status: string) => {
  const data = await prisma.uniform.update({
    where: {
      id: id,
    },
    data: {
      status: status,
    },
  });
  return data;
};

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

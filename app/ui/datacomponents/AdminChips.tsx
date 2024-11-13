"use client";
import React from "react";
import SmallCard from "@/app/ui/components/SmallCard";
import {
  getPendingRequestCount,
  getPendingUniformCount,
} from "@/app/lib/prisma/admin/queries";
import { useEffect, useState } from "react";

const AdminChips = () => {
  const [requestCount, setRequestCount] = useState(0);
  const [uniformCount, setUniformCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const requestCount = await getPendingRequestCount();
      setRequestCount(requestCount);
      const uniformCount = await getPendingUniformCount();
      setUniformCount(uniformCount);
    };
    fetchData();
  }, []);

  return (
    <div className="my-12 flex w-10/12 justify-evenly gap-x-3">
      <SmallCard
        title="Pending Requests"
        amount={requestCount}
        link="/admin/request"
      />
      <SmallCard
        title="Pending Uniforms"
        amount={uniformCount}
        link="/admin/uniform"
      />
      <SmallCard title="Suspend Student" amount={0} link="/admin/suspend" />
    </div>
  );
};

export default AdminChips;

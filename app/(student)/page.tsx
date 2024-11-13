import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import TransactionHistory from "@/app/ui/datacomponents/TransactionHistory";
import TransactionPending from "@/app/ui/datacomponents/TransactionPending";
// Remove tester code
const page = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  } else {
  }
  return (
    <div className="my-11 flex min-h-[75vh] w-full flex-col items-center justify-between gap-y-3 px-8 text-center text-3xl md:flex-row">
      <TransactionHistory studentNumber={data.user.user_metadata.student_id} />
      <TransactionPending studentNumber={data.user.user_metadata.student_id} />
    </div>
  );
};

export default page;

import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import AllUniforms from "@/app/ui/datacomponents/AllUniforms";
// Remove tester code
const page = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  } else {
  }
  return (
    <div className="mt-11 flex min-h-[75vh] w-full flex-col items-center gap-y-3 text-center text-3xl">
      Hello {data.user.user_metadata.name}, <br />
      The uniform orders are listed below:
      <h2 className="text-xl">Click on a transaction to edit it</h2>
      <AllUniforms />
    </div>
  );
};

export default page;

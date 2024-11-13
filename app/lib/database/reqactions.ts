"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

// Fetch User Information
export async function getUserData() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  // console.log(data);
  return { data, error };
}

export async function createRequest(
  materialType: string,
  materialNo: number,
  studentID: string,
  dateTime: string,
  status: "pending" | "approved" | "rejected",
) {
  const supabase = createClient();
  const { error } = await supabase.from("Requests").insert([
    {
      materialType: materialType,
      materialNo: materialNo,
      studentID: studentID,
      dateTime: dateTime,
      status: status,
    },
  ]);

  if (error) {
    console.error(error);
    return { error };
  }

  revalidatePath("/");
  redirect("/?success=true");
}

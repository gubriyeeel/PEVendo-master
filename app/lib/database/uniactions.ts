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

export async function createOrder(
  topSize: string,
  topQuantity: number,
  shortsSize: string,
  shortsQuantity: number,
  pantsSize: string,
  pantsQuantity: number,
  studentID: string,
  dateTime: string,
  status: "pending" | "approved" | "rejected",
) {
  const supabase = createClient();
  const { error } = await supabase.from("Uniform").insert([
    {
      topSize: topSize,
      topQuantity: topQuantity,
      shortsSize: shortsSize,
      shortsQuantity: shortsQuantity,
      pantsSize: pantsSize,
      pantsQuantity: pantsQuantity,
      studentID: studentID,
      dateTime: dateTime,
      status: status,
    },
  ]);

  if (error) {
    console.error(error);
    return { error };
  }
}

"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Fetch Transactions based on student number

export async function getMyRequests(studentNumber: string) {
  // console.log(studentNumber);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Requests")
    .select("*")
    .eq("studentID", Number(studentNumber))
    .order("dateTime", { ascending: false });

  return { data, error };
}

// Fetch Uniforms based on student number

export async function getMyUniforms(studentNumber: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Uniform")
    .select("*")
    .eq("studentID", Number(studentNumber))
    .order("dateTime", { ascending: false });

  return { data, error };
}

// Fetch All Requests

export async function getAllRequests() {
  const supabase = createClient();
  const { data, error } = await supabase.from("Requests").select("*");

  return { data, error };
}

// Fetch all Uniforms

export async function getAllUniforms() {
  const supabase = createClient();
  const { data, error } = await supabase.from("Uniform").select("*");

  return { data, error };
}

// Fetch Request based on ID

export async function getRequestByID(id: number) {
  const supabase = createClient();
  // Get the request and the user who made the request
  const { data, error } = await supabase
    .from("Requests")
    .select(
      `
      *,
      Users ( * )
    `,
    )
    .eq("id", id);
  return { data, error };
}

// Fetch Uniform based on ID
export async function getUniformByID(id: number) {
  const supabase = createClient();
  // Get the request and the user who made the request
  const { data, error } = await supabase
    .from("Uniform")
    .select(
      `
      *,
      Users ( * )
    `,
    )
    .eq("id", id);

  // console.log(data, error);
  return { data, error };
}

// Chang Request Status

export async function changeRequestStatus(id: number, status: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Requests")
    .update({ status: status })
    .eq("id", id);

  if (error) {
    console.error("An error occurred while updating the request status.");
    return { data, error };
  }
  revalidatePath("/admin/request");
}

// Change Uniform Status
export async function changeUniformStatus(id: number, status: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Uniform")
    .update({ status: status })
    .eq("id", id);

  if (error) {
    console.error("An error occurred while updating the request status.");
    return { data, error };
  }
  revalidatePath("/admin/uniform");
}

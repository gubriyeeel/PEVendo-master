"use server";
// TODO: Add database entry for user
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import prisma from "@/lib/db";

export type SignUpState = {
  errors?: {
    name?: string[];
    student_id?: string[];
    course?: string[];
    year?: string[];
    email?: string[];
    password?: string[];
    confirm_password?: string[];
    qr_code?: string[];
  };
  message?: string | null;
};

const SignUpFormSchema = z.object({
  name: z.string(),
  student_id: z.string(),
  course: z.string(),
  year: z.coerce.number(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
  qr_code: z.string(),
  confirm_password: z.string(),
});

export async function signUp(prevState: SignUpState, formData: FormData) {
  const supabase = createClient();
  console.log("Initiating sign-up process...");

  let returned: SignUpState = {
    errors: {},
    message: null,
  };

  // Check required fields
  const requiredFields = [
    "name",
    "student_id",
    "course",
    "year",
    "email",
    "password",
    "confirm_password",
    "qr_code",
  ];

  requiredFields.forEach((field) => {
    if (!formData.get(field)) {
      //@ts-ignore
      returned.errors[field] = [`${field.replace("_", " ")} is required`];
    }
  });
    //@ts-ignore
  if (Object.keys(returned.errors).length > 0) {
    console.log("Validation failed: Missing required fields", returned.errors);
    return returned;
  }

  // if (!(formData.get("email") as string).includes("gsfe.tupcavite.edu.ph")) {
  //   returned.errors.email = ["You must be a student of TUP Cavite to register"];
  //   console.log("Validation failed: Invalid email domain", returned.errors);
  //   return returned;
  // }

  // Validate form fields with Zod
  const validatedFields = SignUpFormSchema.safeParse({
    name: formData.get("name"),
    student_id: formData.get("student_id"),
    course: formData.get("course"),
    year: formData.get("year"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    qr_code: formData.get("qr_code"),
  });

  if (!validatedFields.success) {
    console.log(
      "Validation failed: Zod schema validation errors",
      validatedFields.error.flatten().fieldErrors,
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Something went wrong. Failed to Create Account.",
    };
  }

  // QR Code and Student ID check
  const QR = formData.get("qr_code")?.toString();
  const NAME = formData.get("name")?.toString();
  if (
    QR?.split(" ")[0].toLocaleUpperCase() !==
    validatedFields.data.student_id.toLocaleUpperCase()
  ) {
    console.log("QR code does not match the Student ID.");
    return {
      errors: {
        qr_code: ["QR Code does not match the Student ID"],
      },
      message: "Invalid Input Fields. Failed to Create Account.",
    };
  }

  // Check for existing user by email
  const existingUser = await prisma.users.findFirst({
    where: {
      email: validatedFields.data.email,
    },
  });
  if (existingUser) {
    console.log(
      "User already exists with this email:",
      validatedFields.data.email,
    );
    return {
      errors: {
        email: ["Email already exists"],
      },
      message: "User with email already exists.",
    };
  }

  // Password confirmation check
  if (formData.get("password") !== formData.get("confirm_password")) {
    console.log("Password and confirm password do not match.");
    return {
      errors: {
        password: ["Passwords do not match"],
      },
      message: "Invalid Input Fields. Failed to Create Account.",
    };
  }

  // Attempt to sign up with Supabase Auth
  try {
    const { data, error } = await supabase.auth.signUp({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      options: {
        data: {
          name: validatedFields.data.name,
          student_id: validatedFields.data.student_id,
          course: validatedFields.data.course,
          year: validatedFields.data.year,
          qr_code: validatedFields.data.qr_code,
        },
      },
    });

    if (error) {
      console.error("Supabase Auth sign-up error:", error);
      return {
        message: error.message,
      };
    } else {
      console.log("User successfully signed up with Supabase Auth.");
    }

    // Insert data into Users table
    const { error: insertError } = await supabase.from("Users").insert({
      name: validatedFields.data.name,
      studentID: validatedFields.data.student_id,
      course: validatedFields.data.course,
      year: validatedFields.data.year,
      email: validatedFields.data.email,
      qrCode: validatedFields.data.qr_code,
    });

    if (insertError) {
      console.error("Error inserting user data into Users table:", insertError);
      return {
        message: insertError.message,
      };
    } else {
      console.log("User data successfully inserted into Users table.");
    }
  } catch (error) {
    console.error("Error during sign-up process:", error);
    return {
      message: "Failed. Please try again.",
    };
  }

  console.log(
    "Sign-up process completed successfully. Redirecting to login...",
  );
  revalidatePath("/");
  redirect("/login");
}

export type LogInState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

const LogInFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

export async function logIn(prevState: LogInState, formData: FormData) {
  const supabase = createClient();
  const validatedFields = LogInFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    // console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Log In.",
    };
  }
  // Prepare data for insertion into the database
  const { email, password } = validatedFields.data;
  let admin = null;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      return {
        message: String(error.message),
      };
    }
    admin = data?.user.user_metadata?.admin;
  } catch (error) {
    return {
      message: "Failed. Please try again.",
    };
  }
  if (admin) {
    revalidatePath("/admin");
    redirect("/admin");
  } else {
    revalidatePath("/");
    redirect("/");
  }
}

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/login");
};

// Get user function
export async function getUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}

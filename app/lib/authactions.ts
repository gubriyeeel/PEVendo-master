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
  // Make sure all fields are filled out

  let returned: SignUpState = {
    errors: {},
    message: null,
  };

  if (!formData.get("name")) {
    returned!.errors!.name = ["Name is required"];
  }

  if (!formData.get("student_id")) {
    returned!.errors!.student_id = ["Student ID is required"];
  }

  if (!formData.get("course")) {
    returned!.errors!.course = ["Course is required"];
  }

  if (!formData.get("year")) {
    returned!.errors!.year = ["Year is required"];
  }

  if (!formData.get("email")) {
    returned!.errors!.email = ["Email is required"];
  }

  if (!formData.get("password")) {
    returned!.errors!.password = ["Password is required"];
  }

  if (!formData.get("confirm_password")) {
    returned!.errors!.confirm_password = ["Confirm Password is required"];
  }

  if (!formData.get("qr_code")) {
    returned!.errors!.qr_code = ["QR Code is required"];
  }

  if (
    (formData.get("email") as string).includes("gsfe.tupcavite.edu.ph") ===
    false
  ) {
    returned!.errors!.email = [
      "You must be a student of TUP Cavite to register",
    ];
  }

  // Validate form field formats
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

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    // console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Something went wrong. Failed to Create Account.",
    };
  }

  // Post Validation handling
  const QR = formData.get("qr_code")?.toString();
  const NAME = formData.get("name")?.toString();

  // Compare student ID entered and QR Code
  if (
    QR?.split(" ")[0].toLocaleUpperCase() !==
    validatedFields.data.student_id.toLocaleUpperCase()
  ) {
    return {
      errors: {
        qr_code: ["QR Code does not match the Student ID"],
      },
      message: "Invalid Input Fields. Failed to Create Account.",
    };
  }

  const existingUser = await prisma.users.findFirst({
    where: {
      email: validatedFields.data.email,
    },
  });

  if (existingUser) {
    return {
      errors: {
        email: ["Email already exists"],
      },
      message: "User with email already exists.",
    };
  }

  // Compare name entered and QR Code
  // if (
  //   QR?.split(" ")[1].toLocaleUpperCase() !==
  //   NAME?.split(" ")[NAME?.split(" ").length - 1].toLocaleUpperCase()
  // ) {
  //   return {
  //     errors: {
  //       qr_code: ["QR Code does not match the Name"],
  //     },
  //     message: "Invalid Input Fields. Failed to Create Account.",
  //   };
  // }

  // Password and Confirm Password Validation
  if (formData.get("password") !== formData.get("confirm_password")) {
    return {
      errors: {
        password: ["Passwords do not match"],
      },
      message: "Invalid Input Fields. Failed to Create Account.",
    };
  }

  // Prepare data for insertion into the database
  const { name, student_id, course, year, email, password, qr_code } =
    validatedFields.data;

  // Insert data into the user auth table
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          student_id: student_id,
          course: course,
          year: year,
          qr_code: qr_code,
        },
      },
    });

    if (!error) {
      const { error } = await supabase.from("Users").insert({
        name: name,
        studentID: student_id,
        course: course,
        year: year,
        email: email,
        qrCode: qr_code,
      });
      if (error) {
        console.log(error);
        return {
          message: error.code,
        };
      }
    }
  } catch (error) {
    return {
      message: "Failed. Please try again.",
    };
  }

  // Insert data into the user table

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

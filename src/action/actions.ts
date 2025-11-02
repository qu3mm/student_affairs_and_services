"use server";

import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/lib/zod/auth.schema";
import { signUpSchema } from "@/lib/zod/auth.schema";
import { email, z } from "zod";

export async function login(values: z.infer<typeof loginSchema>) {
  const supabase = await createClient();

  const result = loginSchema.safeParse(values);
  if (!result.success) {
    return {
      status: "error",
      message: result.error.message,
    };
  }

  const data = {
    email: values.email,
    password: values.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  //   revalidatePath("/", "layout");
  //   redirect("/");
  return {
    status: "success",
    message: "Logged in successfully",
  };
}

export async function signUp(values: z.infer<typeof signUpSchema>) {
  const supabase = await createClient();
  const result = signUpSchema.safeParse(values);
  if (!result.success) {
    return {
      status: "error",
      message: result.error.message,
    };
  }
  const data = {
    email: values.email,
    password: values.password,
    options: {
      data: {
        first_name: values.firstName,
        last_name: values.lastName,
        preferred_language: "en",
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  };
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
  return {
    status: "success",
    message: "Account created successfully",
  };
}

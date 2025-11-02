"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { loginSchema } from "@/lib/zod/auth.schema";
import { z } from "zod";

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

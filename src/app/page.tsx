import Hero from "@/components/hero";
import { Navbar } from "@/components/navbar";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  // if (error || !data?.user) {
  //   redirect("/login");
  // }
  return (
    <>
      <div className="mx-5 ">
        <Navbar />
        <Hero />
      </div>
    </>
  );
}

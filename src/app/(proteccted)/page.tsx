import { AboutUs } from "@/components/about-us";
import Hero from "@/components/hero";
import { ServicesSection } from "@/components/services";

import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  // if (error || !data?.user) {
  //   redirect("/login");
  // }
  return (
    <>
      <div className="mx-5 ">
        
        <Hero />
        <ServicesSection />
        
      </div>
    </>
  );
}

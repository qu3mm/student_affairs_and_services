import Hero from "@/components/hero";
import { ServicesSection } from "@/components/services";

export default async function Home() {
  return (
    <>
      <div className="mx-5 ">
        <Hero />
        <ServicesSection />
      </div>
    </>
  );
}

import LoginForm from "@/components/login-form";
import ustp_campus from "../../../../public/images/Alubijid.png";

export default function Page() {
  return (
    <div
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${ustp_campus.src})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
      <div className="w-full relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}

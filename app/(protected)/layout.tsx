import { auth } from "@/lib/auth/auth";
import Sidebar from "../components/Sidebar/Sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen w-full">
      <div className="hidden lg:flex">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl p-6">{children}</div>
        </main>
      </div>

      <div className="lg:hidden">
        <Sidebar />

        <main className="min-w-0 w-full">
          <div className="w-full p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}

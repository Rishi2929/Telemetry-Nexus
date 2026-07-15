import { auth } from "@/lib/auth";
import Sidebar from "../components/Sidebar/Sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";



export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if(!session){
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 lg:flex-row">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
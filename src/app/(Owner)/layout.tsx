import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const role = user?.publicMetadata?.role;

  // Strict check: if the metadata doesn't say 'owner', boot them
  //if (role !== "owner") {
    //redirect("/"); // Send back to landing page or user dashboard
  //}

  return (
    // Replaced the random admin-container with proper flexbox routing to match client
    <div className="flex flex-col min-h-screen">
      {/* Removed the hardcoded p-8 from main so the individual pages can handle their own padding */}
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
    </div>
  );
}
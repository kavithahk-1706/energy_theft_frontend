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
    <div className="admin-container">
      {/* You can add an Admin-specific Sidebar here */}
      <main className="p-8">{children}</main>
    </div>
  );
}
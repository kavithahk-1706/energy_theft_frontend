import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  // If no session exists, redirect to sign-in
  if (!userId) {
    redirect("/"); 
  }

  return (
    <div className="user-interface-wrapper">
      {/* Any user-specific sidebar or navbar sub-menu goes here */}
      <main>{children}</main>
    </div>
  );
}
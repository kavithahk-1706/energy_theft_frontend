import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
// Using absolute path aliases for reliability
import { useOrgTheme } from "@/hooks/org/useOrgTheme"; 
import OrgHeader from "@/components/OrgStatusHeader";
import Sidebar from "@/components/Sidebar";

export default async function OrgAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgSlug: string };
}) {
  const { userId } = await auth(); 
  const user = await currentUser();

  // 1. ROLE & OWNER CHECK [cite: 2026-01-25]
  const userRole = user?.publicMetadata?.role;
  const userOrgSlug = user?.publicMetadata?.orgSlug;
  const isOwner = (user?.primaryEmailAddress?.emailAddress === "pradhyumnavojjala@gmail.com") || (user?.primaryEmailAddress?.emailAddress === "kavithahaimakidambi0613@gmail.com");

  // 2. SECURITY GATE: Allow if Owner OR if the specific Org Admin matches the URL
  const isAuthorizedOrgAdmin = userRole === "org_admin" && userOrgSlug === params.orgSlug;

  //if (!userId || (!isOwner && !isAuthorizedOrgAdmin)) {
    // Redirect to landing page instead of a dead /login link to avoid 404
    //redirect("/"); 
  //}

  // 3. BRANDING LOGIC
  // If you are the owner, we use a default cyan; if org_admin, we use their brand color
  const orgName = (user?.publicMetadata?.orgName as string) || await(params)?.orgSlug?.toUpperCase() || "CLIENT";
  const primaryColor = (user?.publicMetadata?.brandColor as string) || "#00f2ff"; 

  return (
  <div 
    className="os-root flex h-screen overflow-hidden bg-black text-white" 
    style={{ "--neon-cyan": primaryColor } as React.CSSProperties}
  >
    <div className="os-noise pointer-events-none fixed inset-0 opacity-5" />
    <div className="os-scanlines pointer-events-none fixed inset-0 opacity-10" />

    <Sidebar slug={params.orgSlug} />

    {/* Changed: Ensure main takes up all remaining space properly */}
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <OrgHeader companyName={orgName} />
      
      {/* Changed: Added overflow-y-auto here and full height management */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </main>
  </div>
);

}
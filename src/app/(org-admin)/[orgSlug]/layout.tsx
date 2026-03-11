import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { useOrgTheme } from "@/hooks/org/useOrgTheme"; 
import OrgHeader from "@/components/OrgStatusHeader";

export default async function OrgAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgSlug: string };
}) {
  const { userId } = await auth(); 
  const user = await currentUser();

  const userRole = user?.publicMetadata?.role;
  const userOrgSlug = user?.publicMetadata?.orgSlug;
  const isOwner = (user?.primaryEmailAddress?.emailAddress === "pradhyumnavojjala@gmail.com") || (user?.primaryEmailAddress?.emailAddress === "kavithahaimakidambi0613@gmail.com");

  const isAuthorizedOrgAdmin = userRole === "org_admin" && userOrgSlug === params.orgSlug;

  const orgName = (user?.publicMetadata?.orgName as string) || await(params)?.orgSlug?.toUpperCase() || "CLIENT";
  const primaryColor = (user?.publicMetadata?.brandColor as string) || "#00f2ff"; 

  return (
  <div 
    className="os-root flex min-h-screen bg-black text-white" 
    style={{ "--neon-cyan": primaryColor } as React.CSSProperties}
  >
    <div className="os-noise pointer-events-none fixed inset-0 opacity-5" />
    <div className="os-scanlines pointer-events-none fixed inset-0 opacity-10" />

    <main className="flex-1 flex flex-col min-w-0 relative">
      <OrgHeader companyName={orgName} />
      
      {/* actually lets you scroll now lmfao */}
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </main>
  </div>
);
}
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { useOrgTheme } from "@/hooks/org/useOrgTheme"; 
import OrgHeader from "@/components/OrgStatusHeader";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default async function OrgAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>; // NEXTJS 15 FIX: declare as Promise
}) {
  // NEXTJS 15 FIX: We must await the params promise before reading it
  const resolvedParams = await params;
  const slug = resolvedParams.orgSlug || "client";

  const { userId } = await auth(); 
  const user = await currentUser();

  const userRole = user?.publicMetadata?.role;
  const userOrgSlug = user?.publicMetadata?.orgSlug;
  const isOwner = (user?.primaryEmailAddress?.emailAddress === "pradhyumnavojjala@gmail.com") || (user?.primaryEmailAddress?.emailAddress === "kavithahaimakidambi0613@gmail.com");

  const orgName = (user?.publicMetadata?.orgName as string) || slug.toUpperCase();
  const primaryColor = (user?.publicMetadata?.brandColor as string) || "#00f2ff"; 

  return (
  <div 
    className="os-root flex min-h-screen bg-black text-white" 
    style={{ "--neon-cyan": primaryColor } as React.CSSProperties}
  >
    <div className="os-noise pointer-events-none fixed inset-0 opacity-5" />
    <div className="os-scanlines pointer-events-none fixed inset-0 opacity-10" />

    <main className="flex-1 flex flex-col min-w-0 relative">
      
      {/* ⚠️ ADMIN IMPERSONATION BANNER ⚠️ */}
      {isOwner && (
        <div className="bg-purple-900/30 border-b border-purple-500/50 px-6 py-2.5 flex items-center justify-between backdrop-blur-md z-40">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-purple-400 animate-pulse" size={18} />
            <span className="font-mono text-[10px] md:text-xs font-bold tracking-[0.2em] text-purple-300">
              ADMIN OVERRIDE ACTIVE // VIEWING TENANT: <span className="text-white">{slug.toUpperCase()}</span>
            </span>
          </div>
          <Link 
            href="/manage-clients"
            className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/50 text-purple-300 px-4 py-1.5 rounded text-[10px] font-bold tracking-wider transition-all"
          >
            <ArrowLeft size={14} /> <span className="hidden md:inline">RETURN TO ADMIN MODE</span>
          </Link>
        </div>
      )}

      <OrgHeader companyName={orgName} />
      
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>
    </main>
  </div>
);
}
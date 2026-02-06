export default function OrgHeader({ companyName }: { companyName: string }) {
  return (
    <header className="h-16 border-b border-[var(--neon-cyan)]/20 flex items-center px-6">
      <h1 className="text-[var(--neon-cyan)] font-mono text-xl tracking-tighter">
        {companyName?.toUpperCase() || "UTILITY_NODE"}
      </h1>
    </header>
  );
}
export default function Sidebar({ slug }: { slug: string }) {
  return (
    <aside className="w-64 border-r border-[var(--neon-cyan)]/10 bg-black/40 p-4">
      <div className="text-xs text-gray-500 mb-8">ORG_SLUG: {slug}</div>
      <nav className="space-y-2">
        <div className="p-2 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/5">
          DASHBOARD
        </div>
      </nav>
    </aside>
  );
}
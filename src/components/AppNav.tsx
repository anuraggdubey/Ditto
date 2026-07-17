import { Link } from "@tanstack/react-router";

const links = [
  { to: "/onboarding", label: "Onboarding" },
  { to: "/generate", label: "Generate" },
  { to: "/profile", label: "Profile" },
  { to: "/inspiration", label: "Inspiration" },
] as const;

export function AppNav() {
  return (
    <header className="border-b border-hairline bg-paper">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="font-display text-lg text-ink">
          Ditto
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-1.5 text-sm text-graphite transition-colors hover:bg-paper-raised hover:text-ink"
              activeProps={{ className: "rounded-md px-3 py-1.5 text-sm bg-signal-tint text-signal font-medium" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

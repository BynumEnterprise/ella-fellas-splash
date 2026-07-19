import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; children: NavLink[] };
type NavItem = NavLink | NavGroup;

const isGroup = (i: NavItem): i is NavGroup => "children" in i;

const NAV: NavItem[] = [
  { href: "/tour", label: "Tour" },
  // Everything you need the day of the show, grouped so the top nav stays lean.
  {
    label: "At the Show",
    children: [
      { href: "/set-times", label: "Set Times" },
      { href: "/setlists", label: "Setlists" },
      { href: "/openers", label: "Openers" },
    ],
  },
  // The interactive night planner — distinct from /plan-your-trip (the city/venue
  // travel hub), which stays linked from tour pages and guides.
  { href: "/plan-my-night", label: "Plan My Night" },
  { href: "/plan-your-trip", label: "Plan a Trip" },
  { href: "/songs", label: "Songs" },
  { href: "/news", label: "News" },
  { href: "/guides", label: "Guides" },
  { href: "/vs", label: "Compare" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="bg-paper border-b border-ink/10 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl md:text-3xl tracking-wider text-primary">
            ELLA FELLAS
          </span>
          <span className="text-xs text-ink/60 mt-0.5">
            The unofficial Ella Langley superfan HQ
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV.map((item) =>
            isGroup(item) ? (
              <details key={item.label} className="group relative">
                <summary className="list-none cursor-pointer text-ink hover:text-primary transition-colors inline-flex items-center gap-1 select-none">
                  {item.label}
                  <svg
                    className="w-3 h-3 transition-transform group-open:rotate-180"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <div className="absolute right-0 top-full mt-2 bg-paper border border-ink/10 rounded-md shadow-md p-2 min-w-[180px] z-50">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block py-2 px-3 text-ink hover:bg-primary/10 hover:text-primary rounded transition-colors"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-ink hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ),
          )}
          <SearchBox />
        </nav>

        {/* Mobile nav */}
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer p-2 -m-2 text-ink">
            <span className="block w-6 h-0.5 bg-ink mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-ink mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-ink"></span>
          </summary>
          <nav className="absolute right-0 top-full mt-2 bg-paper border border-ink/10 rounded-md shadow-md p-3 min-w-[220px] z-50">
            <SearchBox className="mb-2" />
            {NAV.map((item) =>
              isGroup(item) ? (
                <div key={item.label} className="py-1">
                  <p className="px-3 pt-1 pb-0.5 text-xs uppercase tracking-wider text-clay font-semibold">
                    {item.label}
                  </p>
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block py-2 px-3 text-ink hover:bg-primary/10 rounded"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2 px-3 text-ink hover:bg-primary/10 rounded"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </details>
      </div>
    </header>
  );
}

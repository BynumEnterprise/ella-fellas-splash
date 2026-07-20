import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; children: NavLink[] };
type NavItem = NavLink | NavGroup;

const isGroup = (i: NavItem): i is NavGroup => "children" in i;

/**
 * Six top-level items max — anything more wraps to a second line once the logo
 * and search box are accounted for. Related pages live in dropdowns:
 *  - "At the Show": what you check the day of a specific show
 *  - "Plan": pre-show planning, trip logistics, and ticket budgeting
 *  - "Discover": editorial / browse
 * The full bar only shows at lg+ (≥1024px); below that everything collapses into
 * the hamburger, so tablets never get a cramped, wrapping row.
 */
const NAV: NavItem[] = [
  { href: "/tour", label: "Tour" },
  {
    label: "At the Show",
    children: [
      { href: "/set-times", label: "Set Times" },
      { href: "/setlists", label: "Setlists" },
      { href: "/openers", label: "Openers" },
    ],
  },
  {
    label: "Plan",
    children: [
      { href: "/plan-my-night", label: "Plan My Night" },
      { href: "/plan-your-trip", label: "Plan a Trip" },
      { href: "/ticket-prices", label: "Ticket Prices" },
    ],
  },
  {
    label: "Discover",
    children: [
      { href: "/songs", label: "Songs" },
      { href: "/best-songs", label: "Best Songs" },
      { href: "/news", label: "News" },
      { href: "/guides", label: "Guides" },
      { href: "/vs", label: "Compare Artists" },
    ],
  },
  { href: "/fan-club", label: "Fan Club" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

const Chevron = () => (
  <svg
    className="w-3 h-3 transition-transform group-open:rotate-180"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2.5 4.5L6 8l3.5-3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function Header() {
  return (
    <header className="bg-paper border-b border-ink/10 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex flex-col leading-none shrink-0">
          <span className="font-display text-2xl md:text-3xl tracking-wider text-primary">
            ELLA FELLAS
          </span>
          <span className="hidden sm:block text-xs text-ink/60 mt-0.5">
            The unofficial Ella Langley superfan HQ
          </span>
        </Link>

        {/* Desktop nav — lg and up only */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {NAV.map((item) =>
            isGroup(item) ? (
              <details key={item.label} className="group relative">
                <summary className="list-none cursor-pointer whitespace-nowrap text-ink hover:text-primary transition-colors inline-flex items-center gap-1 select-none">
                  {item.label}
                  <Chevron />
                </summary>
                <div className="absolute left-0 top-full mt-2 bg-paper border border-ink/10 rounded-md shadow-md p-2 min-w-[190px] z-50">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="block py-2 px-3 whitespace-nowrap text-ink hover:bg-primary/10 hover:text-primary rounded transition-colors"
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
                className="whitespace-nowrap text-ink hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ),
          )}
          <SearchBox />
        </nav>

        {/* Mobile / tablet nav — below lg */}
        <details className="lg:hidden relative">
          <summary className="list-none cursor-pointer p-2 -m-2 text-ink" aria-label="Open menu">
            <span className="block w-6 h-0.5 bg-ink mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-ink mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-ink"></span>
          </summary>
          <nav className="absolute right-0 top-full mt-2 bg-paper border border-ink/10 rounded-md shadow-lg p-3 w-[240px] max-h-[80vh] overflow-y-auto z-50">
            <SearchBox className="mb-3" />
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
                  className="block py-2 px-3 font-medium text-ink hover:bg-primary/10 rounded"
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

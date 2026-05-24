import Link from "next/link";

const NAV = [
  { href: "/tour", label: "Tour" },
  { href: "/songs", label: "Songs" },
  { href: "/news", label: "News" },
  { href: "/guides", label: "Guides" },
  { href: "/vs", label: "Compare" },
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
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer p-2 -m-2 text-ink">
            <span className="block w-6 h-0.5 bg-ink mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-ink mb-1.5"></span>
            <span className="block w-6 h-0.5 bg-ink"></span>
          </summary>
          <nav className="absolute right-0 top-full mt-2 bg-paper border border-ink/10 rounded-md shadow-md p-3 min-w-[160px]">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 px-3 text-ink hover:bg-primary/10 rounded"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

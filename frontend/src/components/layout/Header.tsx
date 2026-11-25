const links = [
  { href: "#about", label: "About" },
  { href: "#practice", label: "Try it" },
  { href: "#built-for", label: "Who it's for" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="font-display text-2xl text-moss">
          Interview Wallah
        </a>
        <nav className="hidden gap-8 text-sm md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-ink/70 hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#practice"
          className="rounded-full bg-moss px-5 py-2 text-sm font-medium text-paper hover:opacity-90"
        >
          Start practising
        </a>
      </div>
    </header>
  );
}

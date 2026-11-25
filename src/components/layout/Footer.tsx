export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-ink/60 md:flex-row">
        <span className="font-display text-lg text-moss">Interview Wallah</span>
        <span>Practise out loud. Walk in ready.</span>
        <span>&copy; {new Date().getFullYear()} Interview Wallah</span>
      </div>
    </footer>
  );
}
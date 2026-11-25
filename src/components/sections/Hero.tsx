export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 text-center md:pt-28">
      <p className="mb-5 text-sm font-medium uppercase tracking-widest text-clay">
        AI mock interview coach
      </p>
      <h1 className="font-display text-5xl leading-tight text-ink md:text-7xl">
        Practise speaking <em className="text-moss">out loud</em>,
        <br className="hidden md:block" /> before it counts.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/70">
        Answer interview questions or rehearse a presentation by voice and get instant
        feedback on your pace, filler words and structure.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <a
          href="#practice"
          className="rounded-full bg-moss px-7 py-3 font-medium text-paper hover:opacity-90"
        >
          Try a practice question
        </a>
        <a
          href="#about"
          className="rounded-full border border-ink/20 px-7 py-3 font-medium hover:bg-ink/5"
        >
          How it works
        </a>
      </div>
    </section>
  );
}
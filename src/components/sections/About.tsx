const steps = [
  { n: "01", title: "Pick a question", body: "Choose a common interview question or bring your own talk." },
  { n: "02", title: "Speak your answer", body: "Record out loud, just like the real thing. No typing." },
  { n: "03", title: "Get feedback", body: "See your pace, filler words and a score, with tips to improve." },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-20">
      <h2 className="font-display text-4xl text-ink md:text-5xl">
        Reading answers in your head is not practice.
      </h2>
      <p className="mt-4 max-w-2xl text-ink/70">
        Interviews are spoken. Interview Wallah makes you rehearse the way you will perform,
        and shows you exactly where your delivery slips.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-ink/10 bg-white/50 p-6">
            <span className="font-display text-3xl text-clay">{s.n}</span>
            <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-ink/70">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
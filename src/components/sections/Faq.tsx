const faqs = [
  { q: "Is my voice recording stored?", a: "In this demo, speech is transcribed in your browser and nothing is saved." },
  { q: "Which browsers work for voice?", a: "Chrome and Edge support live speech recognition. In other browsers you can paste or type your answer instead." },
  { q: "How is the score calculated?", a: "It combines your speaking pace (ideal 120 to 170 words per minute), how many filler words you use, and answer length." },
  { q: "Is it free?", a: "The demo on this page is free to try." },
];

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
      <h2 className="font-display text-4xl text-ink md:text-5xl">Questions</h2>
      <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {f.q}
              <span className="text-clay transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-ink/70">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
const items = [
  "Tell me about yourself",
  "Why this company?",
  "Your biggest weakness",
  "A time you led a team",
  "Where do you see yourself in 5 years?",
  "Walk me through your resume",
  "Handling conflict at work",
  "Why should we hire you?",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <section
      aria-label="Common interview questions"
      className="overflow-hidden border-y border-ink/10 bg-moss py-4 text-paper"
    >
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-display text-xl">
        {row.map((q, i) => (
          <span key={i} className="flex items-center gap-10">
            {q}
            <span className="text-clay">&bull;</span>
          </span>
        ))}
      </div>
    </section>
  );
}

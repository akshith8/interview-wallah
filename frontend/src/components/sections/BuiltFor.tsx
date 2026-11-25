const people = [
  { title: "Students & freshers", body: "Campus placements and first-job interviews without the nerves." },
  { title: "Career switchers", body: "Practise telling a clear story about why you are changing paths." },
  { title: "Presenters", body: "Rehearse talks and pitches and keep to time." },
  { title: "Non-native speakers", body: "Build fluency and confidence in a safe space." },
];

export default function BuiltFor() {
  return (
    <section id="built-for" className="bg-moss py-20 text-paper">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="font-display text-4xl md:text-5xl">Built for people who talk for a living, or are about to.</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.map((p) => (
            <div key={p.title} className="rounded-2xl border border-paper/20 p-6">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-paper/75">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

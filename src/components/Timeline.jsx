// src/components/Timeline.jsx
const items = [
  { date: "2025", title: "ModControl", desc: "Dashboard industrial en tiempo real." },
  { date: "2024", title: "COMPOS", desc: "Android + IoT + Cloud." },
  { date: "2023", title: "Portfolio v1", desc: "Primera web personal." },
];

export default function Timeline() {
  return (
    <section className="container-section py-16">
      <h2 className="title">Experiencia & Proyectos</h2>
      <ol className="mt-6 space-y-4">
        {items.map((it) => (
          <li key={it.title} className="card p-4">
            <div className="text-xs text-neutral-500">{it.date}</div>
            <div className="font-semibold">{it.title}</div>
            <div className="subtitle">{it.desc}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}

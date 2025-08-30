// src/components/ProjectCard.jsx
import { Link } from "react-router-dom";

export default function ProjectCard({ p }) {
  return (
    <div className="card p-4 hover:shadow-xl transition">
      <img src={p.cover} alt={p.title} className="w-full h-40 object-cover rounded-xl" />
      <h3 className="mt-3 font-semibold text-lg">{p.title}</h3>
      <p className="subtitle">{p.subtitle}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <span key={t} className="badge">{t}</span>
        ))}
      </div>
      <p className="mt-3 text-sm">{p.summary}</p>
      <div className="mt-4 flex gap-3">
        {p.links.case && <Link className="btn-ghost" to={p.links.case}>Caso</Link>}
        {p.links.demo && <a className="btn-ghost" href={p.links.demo} target="_blank">Demo</a>}
        {p.links.repo && <a className="btn-ghost" href={p.links.repo} target="_blank">Repo</a>}
      </div>
    </div>
  );
}

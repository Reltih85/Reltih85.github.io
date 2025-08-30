// src/pages/Projects.jsx
import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const ALL = "Todos";

export default function Projects() {
  const [filter, setFilter] = useState(ALL);
  const tags = useMemo(() => {
    const set = new Set(projects.flatMap((p) => p.tags));
    return [ALL, ...Array.from(set)];
  }, []);
  const list = projects.filter(p => filter === ALL || p.tags.includes(filter));

  return (
    <section className="container-section py-16">
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`badge ${filter === t ? "ring-2 ring-blue-500" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {list.map(p => <ProjectCard key={p.slug} p={p} />)}
      </div>
    </section>
  );
}

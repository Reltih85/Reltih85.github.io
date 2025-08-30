// src/components/Hero.jsx
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-section grid md:grid-cols-[auto,1fr] gap-8 items-center">
        <img
          src="/me.jpg" // pon tu imagen en public/me.jpg
          alt="Foto de perfil"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-white dark:ring-neutral-900 shadow-lg"
        />
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Frank Y. Bernaola
          </h1>
          <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
            Full-Stack • IoT • Visión por Computador
          </p>
          <p className="mt-4 max-w-xl subtitle">
            Construyo soluciones de punta a punta: frontend moderno, APIs robustas,
            IoT en tiempo real y pipelines con IA.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/projects" className="btn-primary">Ver proyectos</Link>
            <a href="#contacto" className="btn-ghost">Contactar</a>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <a className="underline" href="mailto:tucorreo@ejemplo.com">Email</a>
            <a className="underline" href="https://www.linkedin.com/in/tuusuario" target="_blank">LinkedIn</a>
            <a className="underline" href="https://github.com/tuusuario" target="_blank">GitHub</a>
            <a className="underline" href="https://wa.me/51XXXXXXXXX" target="_blank">WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}

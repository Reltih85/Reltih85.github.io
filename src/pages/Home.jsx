// src/pages/Home.jsx
import Section from "@/components/Section";
import Card from "@/components/Card";
import { Link } from "react-router-dom";
import IconCarousel from "@/components/IconCarousel";
import ErrorBoundary from "@/components/ErrorBoundary";
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import fotoPerfil from "../assets/foto-perfil.jpg"; // <-- asegúrate que EXISTE y la extensión coincide

export default function Home() {
  return (
    <>
      {/* Blob decorativo sutil */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(35rem 20rem at 85% 10%, rgba(56,189,248,.25), transparent 60%), radial-gradient(30rem 20rem at 10% 40%, rgba(139,92,246,.18), transparent 60%)",
        }}
      />

      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
        <div className="container-section grid md:grid-cols-2 gap-10 items-center">
          <div>
            {/* Avatar con imagen (FY eliminado para evitar duplicado) */}
            <div className="flex items-center gap-4">
              <img
                src={fotoPerfil}
                alt="Foto de perfil"
                className="size-16 md:size-40 rounded-full object-cover ring-4 ring-white dark:ring-neutral-900 shadow-lg"
              />
              <div>
                <p className="text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Portafolio
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  Diseño y Desarrollo de Software
                  <br />
                  <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                    Full Stack
                  </span>{" "}
                  con foco en experiencia y calidad
                </h1>
              </div>
            </div>

            <p className="subtitle mt-6 max-w-xl">
              Construyo aplicaciones modernas, mantenibles y orientadas a resultados.
              Aquí verás mis proyectos y un laboratorio con mini-apps útiles (QR, edición de imágenes, video, etc.).
            </p>

            {/* Badges de stack rápido */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge">React</span>
              <span className="badge">Node.js</span>
              <span className="badge">.NET</span>
              <span className="badge">PostgreSQL</span>
              <span className="badge">Firebase</span>
              <span className="badge">Docker</span>
              <span className="badge">MQTT / IoT</span>
            </div>

            {/* CTA + Redes */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link to="/projects" className="btn-primary">
                Ver proyectos
              </Link>
              <Link to="/apps" className="btn-ghost">
                Ir a las Apps
              </Link>

              <div className="ml-1 h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden md:block" />
              <div className="flex items-center gap-3">
                <a
                  href="mailto:bernaola.p.frank@gmail.com"
                  aria-label="Email"
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <FaEnvelope />
                </a>
                <a
                  href="https://www.linkedin.com/in/frank-yampierre-bernaola-pacheco/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://github.com/Reltih85"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://wa.me/51968949651"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>

          <Card className="md:justify-self-end overflow-hidden">
            <div className="px-4 pt-4">
              <h3 className="text-sm font-semibold tracking-wide text-neutral-500 dark:text-neutral-400">
                Stack & herramientas
              </h3>
            </div>
            <ErrorBoundary>
              <IconCarousel pxPerSec={70} stepItems={1} clickMs={550} />
            </ErrorBoundary>
            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400 text-center">
              Disponible para colaboraciones y proyectos freelance.
            </p>
          </Card>
        </div>
      </section>

      {/* Franja métrica breve (credibilidad) */}
      <section className="py-6">
        <div className="container-section grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { k: "10+", v: "Proyectos reales" },
            { k: "5+", v: "Stacks productivos" },
            { k: "99.9%", v: "Uptime logrado" },
            { k: "24/7", v: "Monitoreo/Alertas" },
          ].map((m) => (
            <div
              key={m.v}
              className="card p-4 text-center hover:shadow-lg transition"
            >
              <div className="text-2xl font-extrabold">{m.k}</div>
              <div className="subtitle">{m.v}</div>
            </div>
          ))}
        </div>
      </section>

      <Section title="Destacados" subtitle="Una muestra rápida de mi trabajo.">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-0 group overflow-hidden">
            <div className="h-40 w-full bg-gradient-to-br from-cyan-400/30 to-violet-500/30" />
            <div className="p-4">
              <h3 className="font-semibold group-hover:underline">ModControl</h3>
              <p className="subtitle">
                Dashboard industrial con MQTT, gráficos y alertas.
              </p>
              <Link to="/projects" className="btn-ghost mt-4">
                Ver más
              </Link>
            </div>
          </Card>

          <Card className="p-0 group overflow-hidden">
            <div className="h-40 w-full bg-gradient-to-br from-emerald-400/30 to-cyan-500/30" />
            <div className="p-4">
              <h3 className="font-semibold group-hover:underline">
                Apps de Procesamiento
              </h3>
              <p className="subtitle">
                Herramientas de QR, editor de imágenes y video.
              </p>
              <Link to="/apps" className="btn-ghost mt-4">
                Probar
              </Link>
            </div>
          </Card>

          <Card className="p-0 group overflow-hidden">
            <div className="h-40 w-full bg-gradient-to-br from-amber-400/30 to-pink-500/30" />
            <div className="p-4">
              <h3 className="font-semibold group-hover:underline">
                Integraciones Firebase/.NET
              </h3>
              <p className="subtitle">
                Autenticación, Storage seguro y APIs.
              </p>
              <Link to="/projects" className="btn-ghost mt-4">
                Ver más
              </Link>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}

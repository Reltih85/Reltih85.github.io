import { Mail, Phone, Github, Linkedin, Twitter, Instagram } from "lucide-react";

export default function Contact() {
  return (
    <section className="relative w-full max-w-5xl mx-auto py-20 px-6">
      <div className="relative bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-lg p-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-neutral-900 dark:text-neutral-100">
          Contáctame
        </h2>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto">
          Conecta conmigo a través de mis redes o envíame un mensaje directo. 
          Siempre estoy abierto a nuevas oportunidades 🚀
        </p>

        {/* Grid de redes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="mailto:tucorreo@email.com"
            className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 hover:border-indigo-500 transition"
          >
            <Mail className="w-7 h-7 text-indigo-500 group-hover:scale-110 transition" />
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">Email</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              tucorreo@email.com
            </span>
          </a>

          <a
            href="https://wa.me/51999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 hover:border-green-500 transition"
          >
            <Phone className="w-7 h-7 text-green-500 group-hover:scale-110 transition" />
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">WhatsApp</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              +51 999 999 999
            </span>
          </a>

          <a
            href="https://github.com/tuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-500 transition"
          >
            <Github className="w-7 h-7 text-neutral-700 dark:text-neutral-300 group-hover:scale-110 transition" />
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">GitHub</span>
          </a>

          <a
            href="https://linkedin.com/in/tuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 hover:border-sky-600 transition"
          >
            <Linkedin className="w-7 h-7 text-sky-600 group-hover:scale-110 transition" />
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">LinkedIn</span>
          </a>

          <a
            href="https://twitter.com/tuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 hover:border-sky-400 transition"
          >
            <Twitter className="w-7 h-7 text-sky-400 group-hover:scale-110 transition" />
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">Twitter</span>
          </a>

          <a
            href="https://instagram.com/tuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 hover:border-pink-500 transition"
          >
            <Instagram className="w-7 h-7 text-pink-500 group-hover:scale-110 transition" />
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">Instagram</span>
          </a>
        </div>
      </div>
    </section>
  );
}

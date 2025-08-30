import Section from '@/components/Section'


export default function Contact(){
  return (
    <Section title="Contacto" subtitle="¿Tienes un proyecto en mente? Hablemos.">
      <form className="card p-6 max-w-xl">
        <label className="block mb-3">
          <span className="text-sm">Nombre</span>
          <input
            className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 px-3 py-2"
            placeholder="Tu nombre"
          />
        </label>
        <label className="block mb-3">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 px-3 py-2"
            placeholder="tu@email.com"
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Mensaje</span>
          <textarea
            rows="4"
            className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 px-3 py-2"
            placeholder="Cuéntame brevemente"
          ></textarea>
        </label>
        <button type="button" className="btn-primary">Enviar</button>
      </form>
    </Section>
  )
}

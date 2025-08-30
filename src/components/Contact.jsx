// src/components/Contact.jsx
export default function Contact() {
  return (
    <section id="contacto" className="container-section py-16">
      <div className="card p-6 md:p-8 text-center">
        <h2 className="title">¿Hablamos?</h2>
        <p className="subtitle mt-2">Cuéntame tu idea en 3 líneas y te respondo hoy.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a className="btn-primary" href="mailto:tucorreo@ejemplo.com">Enviar Email</a>
          <a className="btn-ghost" href="https://wa.me/51XXXXXXXXX" target="_blank">WhatsApp</a>
          <a className="btn-ghost" href="https://www.linkedin.com/in/tuusuario" target="_blank">LinkedIn</a>
        </div>
      </div>
    </section>
  );
}

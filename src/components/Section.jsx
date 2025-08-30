export default function Section({ title, subtitle, children }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container-section">
        {title && <h2 className="title mb-2">{title}</h2>}
        {subtitle && <p className="subtitle mb-8">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}

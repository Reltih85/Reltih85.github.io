export default function Card({ children }) {
  return <div className="rounded-xl shadow-lg p-4 bg-white dark:bg-gray-800">{children}</div>
}

// Export nombrado
export function Section({ title, subtitle, children }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  )
}

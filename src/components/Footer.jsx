export default function Footer(){
  return (
    <footer className="border-t border-neutral-200/60 dark:border-neutral-800">
      <div className="container-section py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Frank Bernaola • Diseño y Desarrollo de Software</p>
        <p className="text-neutral-500">Hecho con React + Vite + Tailwind</p>
      </div>
    </footer>
  )
}

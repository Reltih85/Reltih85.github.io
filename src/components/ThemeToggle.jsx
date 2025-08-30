import { useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'


export default function ThemeToggle(){
  const { theme, toggle } = useTheme()

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  return (
    <button onClick={toggle} className="btn-ghost" aria-label="Cambiar tema">
      {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
      <span className="sr-only">Tema</span>
    </button>
  )
}

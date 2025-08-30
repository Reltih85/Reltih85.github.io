import Section from '@/components/Section'
import Card from '@/components/Card'
import apps from '@/data/apps'
import { Link } from 'react-router-dom'


export default function Apps(){
  return (
    <Section title="Apps" subtitle="Laboratorio de utilidades que voy ampliando.">
      <div className="grid md:grid-cols-3 gap-6">
        {apps.map(app => (
          <Card key={app.slug}>
            <h3 className="text-xl font-semibold">{app.title}</h3>
            <p className="subtitle">{app.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {app.tags.map(t => (
                <span key={t} className="badge">{t}</span>
              ))}
            </div>
            <Link to={app.path} className="btn-ghost mt-4">Abrir</Link>
          </Card>
        ))}
      </div>
    </Section>
  )
}

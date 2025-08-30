import Section from '@/components/Section'
import Card from '@/components/Card'


export default function VideoTools(){
return (
<Section title="Herramientas de Video" subtitle="Descarga/convertir (UI demo, backend aparte por TOS).">
<Card>
<div className="grid sm:grid-cols-2 gap-4">
<label className="block">
<span className="text-sm">URL del video</span>
<input className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 px-3 py-2" placeholder="Pega la URL" />
</label>
<label className="block">
<span className="text-sm">Formato</span>
<select className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 px-3 py-2">
<option>MP4</option>
<option>MP3</option>
<option>WEBM</option>
</select>
</label>
</div>
<div className="mt-4 flex gap-2">
<button className="btn-primary">Procesar</button>
<button className="btn-ghost">Descargar</button>
</div>
<p className="text-xs text-neutral-500 mt-3">Nota: el procesamiento real requiere un backend propio (por ejemplo con yt-dlp) para respetar TOS y derechos.</p>
</Card>
</Section>
)
}

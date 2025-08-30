import { useState } from 'react'
import Section from '@/components/Section'
import Card from '@/components/Card'


export default function RemoveBg(){
const [file, setFile] = useState(null)
const [preview, setPreview] = useState('')
const [result, setResult] = useState('')
const [loading, setLoading] = useState(false)


const onFile = e => {
const f = e.target.files?.[0]
if (!f) return
setFile(f)
const reader = new FileReader()
reader.onload = () => setPreview(reader.result)
reader.readAsDataURL(f)
}


const process = async () => {
if (!file) return
setLoading(true)
try {
// TODO: Enviar a tu API para quitar fondo (U2-Net/ONNX o servicio externo)
// const form = new FormData(); form.append('image', file)
// const res = await fetch('/api/remove-bg', { method: 'POST', body: form })
// const { dataUrl } = await res.json()
// setResult(dataUrl)
await new Promise(r=>setTimeout(r, 1200)) // demo
setResult(preview) // placeholder
} finally {
setLoading(false)
}
}


const download = () => {
if (!result) return
const a = document.createElement('a')
a.href = result
a.download = `imagen-sin-fondo-${Date.now()}.png`
a.click()
}


return (
<Section title="Quitar fondo" subtitle="Sube una imagen y procesa el fondo (beta).">
<div className="grid md:grid-cols-2 gap-6 items-start">
<Card>
<input type="file" accept="image/*" onChange={onFile} />
<div className="grid grid-cols-2 gap-3 mt-4">
<div>
<p className="text-sm mb-2">Original</p>
{preview ? <img src={preview} className="rounded-xl"/> : <div className="h-48 rounded-xl bg-neutral-100 dark:bg-neutral-800"/>}
</div>
<div>
<p className="text-sm mb-2">Resultado</p>
{result ? <img src={result} className="rounded-xl"/> : <div className="h-48 rounded-xl bg-neutral-100 dark:bg-neutral-800"/>}
</div>
</div>
<div className="mt-4 flex gap-2">
<button onClick={process} disabled={!file || loading} className="btn-primary disabled:opacity-50">{loading? 'Procesando…':'Quitar fondo'}</button>
<button onClick={download} disabled={!result} className="btn-ghost disabled:opacity-50">Descargar</button>
</div>
</Card>
</div>
</Section>
)
}

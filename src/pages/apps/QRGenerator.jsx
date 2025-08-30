import { useEffect, useRef, useState } from 'react'
import Section from '@/components/Section'
import Card from '@/components/Card'
import QRCode from 'qrcode'


export default function QRGenerator(){
const [text, setText] = useState('https://tu-dominio.dev')
const [size, setSize] = useState(256)
const [dataUrl, setDataUrl] = useState('')
const canvasRef = useRef(null)


useEffect(() => { generate() }, [])


const generate = async () => {
try {
const url = await QRCode.toDataURL(text, { width: size, margin: 2 })
setDataUrl(url)
if (canvasRef.current) {
const img = new Image()
img.onload = () => {
const ctx = canvasRef.current.getContext('2d')
canvasRef.current.width = size
canvasRef.current.height = size
ctx.clearRect(0,0,size,size)
ctx.drawImage(img, 0, 0, size, size)
}
img.src = url
}
} catch (e) {
console.error(e)
}
}


const download = () => {
const link = document.createElement('a')
link.href = dataUrl
link.download = `qr-${Date.now()}.png`
link.click()
}


return (
<Section title="Generador de QR" subtitle="Crea un QR en segundos y descárgalo como PNG.">
<div className="grid md:grid-cols-2 gap-6 items-start">
<Card>
<label className="block mb-3">
<span className="text-sm">Texto/URL</span>
<input value={text} onChange={e=>setText(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 px-3 py-2" placeholder="Escribe el contenido"/>
</label>
<label className="block mb-4">
<span className="text-sm">Tamaño</span>
<input type="range" min="128" max="512" step="64" value={size} onChange={e=>setSize(Number(e.target.value))} className="w-full"/>
<div className="text-xs text-neutral-500 mt-1">{size}px</div>
</label>
<div className="flex gap-2">
<button onClick={generate} className="btn-primary">Generar</button>
<button onClick={download} disabled={!dataUrl} className="btn-ghost disabled:opacity-50">Descargar PNG</button>
</div>
</Card>
<Card className="flex items-center justify-center aspect-square">
<canvas ref={canvasRef} className="rounded-2xl" />
</Card>
</div>
</Section>
)
}

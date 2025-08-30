// src/components/About.jsx
export default function About() {
  return (
    <section className="container-section py-16">
      <h2 className="title">Sobre mí</h2>
      <p className="subtitle mt-3 max-w-3xl">
        Soy desarrollador full-stack con foco en experiencia, calidad y sistemas en tiempo real.
        Me muevo cómodo entre frontend moderno, APIs, bases de datos y hardware IoT.
      </p>
      <ul className="mt-6 grid md:grid-cols-2 gap-3 text-sm">
        <li>• Frontend: React/Next, Tailwind, diseño accesible.</li>
        <li>• Backend: Node/FastAPI/.NET, APIs REST/WS.</li>
        <li>• Data/IA: Python, OpenCV, Pandas, modelos en producción.</li>
        <li>• IoT: MQTT, ESP32, Node-RED, Firebase.</li>
        <li>• DevOps: Docker, CI/CD, nubes (AWS/GCP/Azure).</li>
      </ul>
    </section>
  );
}

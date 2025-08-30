// src/data/projects.js
export const projects = [
  {
    slug: "modcontrol",
    title: "ModControl",
    subtitle: "Monitoreo industrial en tiempo real",
    cover: "/projects/modcontrol.jpg",
    tags: ["Android", "MQTT", "Node-RED", "ESP32", "Firebase"],
    summary: "Dashboard y alertas en vivo para celdas industriales.",
    links: {
      repo: "https://github.com/tuusuario/modcontrol",
      demo: "#",
      case: "/projects/modcontrol",
    },
  },
  {
    slug: "compos",
    title: "COMPOS",
    subtitle: "Android + IoT + Cloud",
    cover: "/projects/compos.jpg",
    tags: ["Android", "ESP32", "MQTT", "Firebase", "Cloud"],
    summary: "Monitoreo y control móvil con backend en la nube.",
    links: {
      repo: "https://github.com/tuusuario/compos",
      case: "/projects/compos",
    },
  },
  {
    slug: "portfolio-v1",
    title: "Portfolio v1",
    subtitle: "GitHub Pages",
    cover: "/projects/portfolio.jpg",
    tags: ["HTML", "CSS", "Static"],
    summary: "Primera versión de mi portafolio personal.",
    links: {
      demo: "https://tuusuario.github.io",
      repo: "https://github.com/tuusuario/tuusuario.github.io",
    },
  },
];

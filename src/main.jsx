import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/globals.css'
import App from './App'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Apps from './pages/Apps'
import Contact from './pages/Contact'
import QRGenerator from './pages/apps/QRGenerator'
import RemoveBg from './pages/apps/RemoveBg'
import VideoTools from './pages/apps/VideoTools'
import KanbanApp from '@/apps/kanban';
import "./lib/firebase";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="apps" element={<Apps />} />
          <Route path="apps/qr" element={<QRGenerator />} />
          <Route path="apps/remove-bg" element={<RemoveBg />} />
          <Route path="apps/video-tools" element={<VideoTools />} />
          <Route path="apps/kanban" element={<KanbanApp />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

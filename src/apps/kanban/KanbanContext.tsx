import React, { createContext, useContext, useMemo, useState } from 'react';
import { Project, Task, TaskStatus } from './types';
import { loadProjects, saveProjects } from './storage';
import { createSaltAndHash, verifyPassword } from './crypto';

type Ctx = {
  projects: Project[];
  selectedId: string | null;
  unlocked: Set<string>;

  selectProject: (id: string | null) => void;

  createProject: (name: string, password?: string) => Promise<void>;
  unlockProject: (id: string, password: string) => Promise<boolean>;

  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;

  addTask: (projectId: string, title: string, hours?: number, owner?: string) => void;
  updateTask: (projectId: string, taskId: string, patch: Partial<Task>) => void;
  moveTask: (projectId: string, taskId: string, dir: 'left' | 'right') => void;
  deleteTask: (projectId: string, taskId: string) => void;
};

const KanbanContext = createContext<Ctx | null>(null);

// -------- persistencia de desbloqueos en la sesión (misma pestaña) ----------
const UNLOCKED_KEY = 'kanban_unlocked_ids';
function loadUnlocked(): Set<string> {
  try {
    const raw = sessionStorage.getItem(UNLOCKED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}
function saveUnlocked(set: Set<string>) {
  try {
    sessionStorage.setItem(UNLOCKED_KEY, JSON.stringify([...set]));
  } catch {}
}
// ---------------------------------------------------------------------------

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<Set<string>>(() => loadUnlocked());

  const persist = (next: Project[]) => {
    setProjects(next);
    saveProjects(next);
  };

  const selectProject = (id: string | null) => {
  // Si estamos saliendo del tablero (id === null), volver a bloquear el que estaba abierto
  if (id === null && selectedId) {
    setUnlocked(prev => {
      const next = new Set(prev);
      next.delete(selectedId);      // ← lo quitamos de la sesión actual
      // si usas sessionStorage/localStorage para persistir desbloqueos, actualízalo también:
      try {
        sessionStorage.setItem('kanban_unlocked_ids', JSON.stringify([...next]));
      } catch {}
      return next;
    });
    }
    setSelectedId(id);
    };

  const updateProject = (id: string, updater: (p: Project) => Project) => {
    const next = projects.map(p => (p.id === id ? updater(p) : p));
    persist(next);
  };

  // Crear proyecto con contraseña (opcional)
  const createProject = async (name: string, password?: string) => {
    const id = crypto.randomUUID();
    let locked = false, passwordSalt: string | undefined, passwordHash: string | undefined;
    if (password && password.trim()) {
      const creds = await createSaltAndHash(password);
      locked = true;
      passwordSalt = creds.salt;
      passwordHash = creds.hash;
    }
    persist([...projects, {
      id,
      name: name.trim() || 'Nuevo proyecto',
      locked,
      passwordSalt,
      passwordHash,
      tasks: [],
    }]);
  };

  // Desbloquear (guarda en sessionStorage para no pedir de nuevo)
  const unlockProject = async (id: string, password: string) => {
    const p = projects.find(x => x.id === id);
    if (!p) return false;
    if (!p.locked || !p.passwordSalt || !p.passwordHash) return true;

    const ok = await verifyPassword(password, p.passwordSalt, p.passwordHash);
    if (ok) {
      setUnlocked(prev => {
        const next = new Set(prev);
        next.add(id);
        saveUnlocked(next);
        return next;
      });
    }
    return ok;
  };

  // Proyectos
  const renameProject = (id: string, name: string) => {
    updateProject(id, p => ({ ...p, name: name.trim() || p.name }));
  };
  const deleteProject = (id: string) => {
    // quita también de desbloqueados
    setUnlocked(prev => {
      const next = new Set(prev);
      next.delete(id);
      saveUnlocked(next);
      return next;
    });
    persist(projects.filter(p => p.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  };

  // Tareas
  const addTask = (projectId: string, title: string, hours = 0, owner = '') => {
    updateProject(projectId, p => ({
      ...p,
      tasks: [...p.tasks, { id: crypto.randomUUID(), title: title.trim() || 'Nueva tarea', status: 'todo', hours, owner }],
    }));
  };
  const updateTask = (projectId: string, taskId: string, patch: Partial<Task>) => {
    updateProject(projectId, p => ({
      ...p,
      tasks: p.tasks.map(t => (t.id === taskId ? { ...t, ...patch } : t)),
    }));
  };
  const moveTask = (projectId: string, taskId: string, dir: 'left' | 'right') => {
    const order: TaskStatus[] = ['todo', 'inprogress', 'done'];
    updateProject(projectId, p => ({
      ...p,
      tasks: p.tasks.map(t => {
        if (t.id !== taskId) return t;
        const idx = order.indexOf(t.status);
        const nextIdx = dir === 'left' ? Math.max(0, idx - 1) : Math.min(order.length - 1, idx + 1);
        return { ...t, status: order[nextIdx] };
      }),
    }));
  };
  const deleteTask = (projectId: string, taskId: string) => {
    updateProject(projectId, p => ({ ...p, tasks: p.tasks.filter(t => t.id !== taskId) }));
  };

  const value = useMemo<Ctx>(() => ({
    projects,
    selectedId,
    unlocked,
    selectProject,
    createProject,
    unlockProject,
    renameProject,
    deleteProject,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
  }), [projects, selectedId, unlocked]);

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
};

export const useKanban = () => {
  const ctx = useContext(KanbanContext);
  if (!ctx) throw new Error('useKanban must be used within KanbanProvider');
  return ctx;
};

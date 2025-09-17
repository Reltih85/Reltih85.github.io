import React, { createContext, useContext, useMemo, useState } from 'react';
import { Project, Task, TaskStatus } from './types';
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

// Memoria pura
export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  const selectProject = (id: string | null) => {
    setSelectedId(id);
    if (id === null) setUnlocked(new Set());
  };

  const updateProject = (id: string, updater: (p: Project) => Project) => {
    setProjects(prev => prev.map(p => (p.id === id ? updater(p) : p)));
  };

  const createProject = async (name: string, password?: string) => {
    const id = crypto.randomUUID();
    let locked = false, passwordSalt: string | undefined, passwordHash: string | undefined;
    if (password && password.trim()) {
      const creds = await createSaltAndHash(password);
      locked = true;
      passwordSalt = creds.salt;
      passwordHash = creds.hash;
    }
    setProjects(prev => [...prev, {
      id,
      name: (name ?? '').trim() || 'Nuevo proyecto',
      locked,
      passwordSalt,
      passwordHash,
      tasks: [],
    }]);
  };

  const unlockProject = async (id: string, password: string) => {
    const p = projects.find(x => x.id === id);
    if (!p) return false;
    if (!p.locked || !p.passwordSalt || !p.passwordHash) return true;

    const ok = await verifyPassword(password, p.passwordSalt, p.passwordHash);
    if (ok) setUnlocked(prev => new Set(prev).add(id));
    return ok;
  };

  const renameProject = (id: string, name: string) => {
    updateProject(id, p => ({ ...p, name: name.trim() || p.name }));
  };
  const deleteProject = (id: string) => {
    setUnlocked(prev => { const n = new Set(prev); n.delete(id); return n; });
    setProjects(prev => prev.filter(p => p.id !== id));
    setSelectedId(prev => (prev === id ? null : prev));
  };

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

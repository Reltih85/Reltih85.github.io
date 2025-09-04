import React, { useMemo, useState } from 'react';
import { useKanban } from './KanbanContext';
import { Task, TaskStatus } from './types';

const columns: { key: TaskStatus; title: string }[] = [
  { key: 'todo',       title: 'To Do' },
  { key: 'inprogress', title: 'In Progress' },
  { key: 'done',       title: 'Done' },
];

const statusClass: Record<TaskStatus, string> = {
  todo: 'task task--todo',
  inprogress: 'task task--inprogress',
  done: 'task task--done',
};

function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 7l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 17l5-5-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TaskCard({
  task,
  onPatch,
  onMoveLeft,
  onMoveRight,
  onDelete,
}: {
  task: Task;
  onPatch: (patch: Partial<Task>) => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDelete: () => void;
}) {
  const [editingTitle, setEditingTitle] = useState(false);

  return (
    <div className={statusClass[task.status]}>
      {/* Título */}
      <div className="mb-3">
        {editingTitle ? (
          <input
            className="input-soft w-full px-3 py-2"
            value={task.title}
            onChange={(e) => onPatch({ title: e.target.value })}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === 'Escape') && setEditingTitle(false)}
            autoFocus
          />
        ) : (
          <div
            className="cursor-text text-sm leading-5"
            title="Doble clic para editar"
            onDoubleClick={() => setEditingTitle(true)}
          >
            {task.title}
          </div>
        )}
      </div>

      {/* Metadatos */}
      <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <label className="block text-neutral-500 dark:text-neutral-400">Horas</label>
          <input
            type="number"
            min={0}
            className="input-soft w-full px-2 py-1"
            value={task.hours}
            onChange={(e) => onPatch({ hours: Number(e.target.value || 0) })}
          />
        </div>

        <div className="col-span-2 space-y-1">
          <label className="block text-neutral-500 dark:text-neutral-400">Responsable</label>
          <input
            placeholder="Nombre o alias…"
            className="input-soft w-full px-2 py-1"
            value={task.owner}
            onChange={(e) => onPatch({ owner: e.target.value })}
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-2">
          <button className="btn-soft-primary" onClick={onMoveLeft} title="Mover a la izquierda">
            <ArrowLeft /> <span className="hidden sm:inline">Mover</span>
          </button>
          <button className="btn-soft-primary" onClick={onMoveRight} title="Mover a la derecha">
            <span className="hidden sm:inline">Mover</span> <ArrowRight />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-soft-danger" onClick={onDelete}>Borrar</button>
        </div>
      </div>
    </div>
  );
}

export default function Board() {
  const { projects, selectedId, selectProject, addTask, updateTask, moveTask, deleteTask } = useKanban();
  const project = useMemo(() => projects.find(p => p.id === selectedId) ?? null, [projects, selectedId]);

  const [newTask, setNewTask] = useState('');
  const [newHours, setNewHours] = useState<number | ''>('');
  const [newOwner, setNewOwner] = useState('');

  if (!project) return null;

  const grouped = {
    todo: project.tasks.filter(t => t.status === 'todo'),
    inprogress: project.tasks.filter(t => t.status === 'inprogress'),
    done: project.tasks.filter(t => t.status === 'done'),
  };

  const badge = (n: number, key: TaskStatus) => {
    const cls =
      key === 'todo' ? 'count--todo' :
      key === 'inprogress' ? 'count--inprogress' :
      'count--done';
    return <span className={cls}>{n}</span>;
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{project.tasks.length} tareas</p>
        </div>
        <button onClick={() => selectProject(null)} className="btn-soft-neutral">
          ← Volver a Proyectos
        </button>
      </header>

      {/* Creador de tareas */}
      <div className="glass mb-5 grid gap-2 p-3 md:grid-cols-5">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Título de la tarea…"
          className="input-soft md:col-span-3 px-4 py-2"
        />
        <input
          type="number"
          min={0}
          value={newHours}
          onChange={e => setNewHours(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Horas"
          className="input-soft px-4 py-2"
        />
        <input
          value={newOwner}
          onChange={e => setNewOwner(e.target.value)}
          placeholder="Responsable"
          className="input-soft px-4 py-2"
        />
        <button
          onClick={() => {
            addTask(project.id, newTask, Number(newHours || 0), newOwner);
            setNewTask(''); setNewHours(''); setNewOwner('');
          }}
          className="btn-soft-neutral md:col-span-5 md:mt-0 mt-2"
        >
          Añadir tarea
        </button>
      </div>

      {/* Columnas */}
      <div className="grid gap-4 md:grid-cols-3">
        {columns.map(c => (
          <section key={c.key} className="glass p-3">
            <h2 className="col-title mb-3 flex items-center">
              {c.title} {badge(grouped[c.key].length, c.key)}
            </h2>
            <div className="space-y-3">
              {grouped[c.key].map(t => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onPatch={(patch) => updateTask(project.id, t.id, patch)}
                  onMoveLeft={() => moveTask(project.id, t.id, 'left')}
                  onMoveRight={() => moveTask(project.id, t.id, 'right')}
                  onDelete={() => deleteTask(project.id, t.id)}
                />
              ))}
              {grouped[c.key].length === 0 && (
                <div className="glass border-dashed p-4 text-center text-xs text-neutral-500">
                  Sin tareas
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

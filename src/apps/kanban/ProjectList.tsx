import React, { useState } from 'react';
import { useKanban } from './KanbanContext';

export default function ProjectList() {
  const {
    projects,
    createProject,
    renameProject,
    deleteProject,
    selectProject,
    unlocked,
    unlockProject,
  } = useKanban();

  const [name, setName] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwdVisible, setNewPwdVisible] = useState(false);

  const [pwdById, setPwdById] = useState<Record<string, string>>({});
  const setPwd = (id: string, val: string) =>
    setPwdById(prev => ({ ...prev, [id]: val }));

  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Proyectos</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Crea y gestiona tus tableros (localStorage).
        </p>
      </header>

      {/* Crear proyecto (nombre + contraseña opcional con ojito) */}
      <div className="mb-6 grid gap-2 sm:grid-cols-[1fr_280px_auto]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del proyecto..."
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await createProject(name, newPwd);
              setName(''); setNewPwd('');
            }
          }}
          className="input-plain"
        />

        <div className="relative">
          <input
            type={newPwdVisible ? 'text' : 'password'}
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            placeholder="Contraseña (opcional)"
            className="input-plain pr-10 w-full"
          />
          <button
            type="button"
            onClick={() => setNewPwdVisible(v => !v)}
            className="absolute inset-y-0 right-2 my-auto text-sm text-neutral-500 hover:text-neutral-300"
            title={newPwdVisible ? 'Ocultar' : 'Mostrar'}
          >
            {newPwdVisible ? '🙈' : '👁️'}
          </button>
        </div>

        <button
          onClick={async () => { await createProject(name, newPwd); setName(''); setNewPwd(''); }}
          className="btn-soft-elev"
        >
          Crear
        </button>
      </div>

      {/* Lista de proyectos */}
      <ul className="grid gap-3 sm:grid-cols-2">
        {projects.map((p) => {
          const isLocked = !!p.locked && !!p.passwordHash && !!p.passwordSalt;
          const isUnlocked = unlocked.has(p.id);
          const disabled = isLocked && !isUnlocked;

          return (
            <li key={p.id} className="glass-strong p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2">
                <input
                  defaultValue={p.name}
                  onBlur={(e) => renameProject(p.id, e.target.value)}
                  className="input-plain flex-1 bg-transparent px-2 py-1 dark:bg-transparent dark:ring-neutral-800"
                />
                <button
                  disabled={disabled}
                  onClick={() => selectProject(p.id)}
                  className={`btn-soft-primary ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={disabled ? 'Ingresa la contraseña para habilitar' : 'Abrir'}
                >
                  Abrir
                </button>
                <button
                  disabled={disabled}
                  onClick={() => { if (confirm(`¿Eliminar "${p.name}"?`)) deleteProject(p.id); }}
                  className={`btn-soft-danger ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={disabled ? 'Ingresa la contraseña para habilitar' : 'Borrar'}
                >
                  Borrar
                </button>
              </div>

              {/* Verificación si está bloqueado */}
              {disabled && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="password"
                    placeholder="Contraseña del proyecto"
                    value={pwdById[p.id] || ''}
                    onChange={(e) => setPwd(p.id, e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        const ok = await unlockProject(p.id, pwdById[p.id] || '');
                        if (!ok) alert('Contraseña incorrecta'); else setPwd(p.id, '');
                      }
                    }}
                    className="input-plain flex-1"
                  />
                  <button
                    onClick={async () => {
                      const ok = await unlockProject(p.id, pwdById[p.id] || '');
                      if (!ok) alert('Contraseña incorrecta'); else setPwd(p.id, '');
                    }}
                    className="btn-soft-primary"
                  >
                    Verificar
                  </button>
                </div>
              )}

              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                {p.tasks.length} tareas {isLocked && !isUnlocked ? '· protegido' : isLocked ? '· desbloqueado' : ''}
              </p>
            </li>
          );
        })}

        {projects.length === 0 && (
          <div className="glass-strong border-dashed p-10 text-center text-neutral-500">
            Aún no hay proyectos. Crea el primero arriba.
          </div>
        )}
      </ul>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listenBoards, createBoardWithPassword, renameBoard, deleteBoardHard,
  checkBoardPassword
} from "../../services/boardService.js";

const KANBAN_BOARD_PATH = "/apps/kanban/board";

type Board = {
  id: string;
  name: string;
  locked?: boolean;
  createdAt?: any;
};

function Eye({ crossed=false, className="" }: { crossed?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 transition-transform duration-150 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
      {crossed && <path d="M3 3L21 21" />}
    </svg>
  );
}

export default function ProjectList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [pwdById, setPwdById] = useState<Record<string, string>>({});
  const [showPwdById, setShowPwdById] = useState<Record<string, boolean>>({});
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    const off = listenBoards((bs) => setBoards((bs || []) as Board[]));
    return () => off && off();
  }, []);

  // CREAR (no navega; listener actualiza la lista)
  async function create() {
    const projectName = name.trim();
    if (!projectName) return;
    await createBoardWithPassword(projectName, pwd.trim() || undefined);
    setName("");
    setPwd("");
    setShowPwd(false);
  }

  function open(b: Board) {
  if (b.locked && !unlockedIds.has(b.id)) {
    alert("Este proyecto está protegido. Verifícalo primero.");
    return;
  }
  // ← Este flujo es el que entiende tu KanbanApp + Board.tsx
  navigate(`/apps/kanban?b=${encodeURIComponent(b.id)}`);
}

  // VERIFICAR
  async function verify(b: Board) {
    const pass = (pwdById[b.id] || "").trim();
    const ok = await checkBoardPassword(b.id, pass);
    if (!ok) { alert("Contraseña incorrecta"); return; }
    const s = new Set(unlockedIds); s.add(b.id); setUnlockedIds(s);
    setPwdById((prev) => ({ ...prev, [b.id]: "" }));
  }

  // RENOMBRAR (bloqueado si no está verificado y está locked)
  async function doRename(b: Board, newName: string) {
    const nn = newName.trim();
    if (!nn || nn === b.name) return;
    if (b.locked && !unlockedIds.has(b.id)) return;
    await renameBoard(b.id, nn);
  }

  // BORRAR (bloqueado si no está verificado y está locked)
  async function doDelete(b: Board) {
    if (b.locked && !unlockedIds.has(b.id)) return;
    if (!confirm(`¿Eliminar "${b.name}"?`)) return;
    await deleteBoardHard(b.id);
  }

  const list = useMemo(() => boards.filter(b => b && b.name !== "_ping_"), [boards]);
  const empty = list.length === 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Proyectos</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Gestiona tableros en Firestore (realtime).
        </p>
      </header>

      {/* CREAR */}
    <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_minmax(200px,280px)_auto]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del proyecto..."
          onKeyDown={(e) => { if (e.key === "Enter") create(); }}
          className="input-plain"
        />
        <div className="relative">
          <input
            type={showPwd ? "text" : "password"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Contraseña (opcional)"
            className="input-plain pr-10 w-full hide-native-eye"
          />
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            className="absolute inset-y-0 right-2 my-auto text-neutral-900 dark:text-neutral-100 hover:scale-105 transition-transform"
            title={showPwd ? "Ocultar" : "Mostrar"}
            aria-label="Mostrar/Ocultar contraseña"
          >
            <Eye crossed={showPwd} />
          </button>
        </div>

        <button onClick={create} className="btn-soft-elev w-full sm:w-auto shrink-0 whitespace-nowrap">
          Crear
        </button>
      </div>

      {/* LISTA */}
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">

        {list.map((b) => {
          const locked = !!b.locked;
          const isUnlocked = unlockedIds.has(b.id);
          const canOpen = locked ? isUnlocked : true;
          const canDelete = locked ? isUnlocked : true;
          const canRename = locked ? isUnlocked : true;

          return (
            <li key={b.id} className="glass-strong p-4 hover:shadow-lg transition-shadow min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <input
                  defaultValue={b.name}
                  onBlur={(e) => doRename(b, e.target.value)}
                  disabled={!canRename}
                  title={!canRename ? "Verifica la contraseña para renombrar" : "Renombrar"}
                  className={`input-plain flex-1 min-w-0 bg-transparent px-2 py-1 dark:bg-transparent dark:ring-neutral-800 ${!canRename ? "opacity-60 cursor-not-allowed" : ""}`}
                />
                <button
                  disabled={!canOpen}
                  onClick={() => open(b)}
                  className={`btn-soft-primary shrink-0 whitespace-nowrap ${!canOpen ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Abrir
                </button>
                <button
                  disabled={!canDelete}
                  onClick={() => doDelete(b)}
                  className={`btn-soft-danger shrink-0 whitespace-nowrap ${!canDelete ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Borrar
                </button>

              </div>

              {locked && !isUnlocked && (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1 min-w-0">
                    <input
                      type={showPwdById[b.id] ? "text" : "password"}
                      placeholder="Contraseña del proyecto"
                      value={pwdById[b.id] || ""}
                      onChange={(e) => setPwdById(p => ({ ...p, [b.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") verify(b); }}
                      className="input-plain pr-10 w-full hide-native-eye"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwdById(m => ({ ...m, [b.id]: !m[b.id] }))}
                      className="absolute inset-y-0 right-2 my-auto text-neutral-900 dark:text-neutral-100 hover:scale-105 transition-transform"
                      title={showPwdById[b.id] ? "Ocultar" : "Mostrar"}
                      aria-label="Mostrar/Ocultar contraseña"
                    >
                      <Eye crossed={!!showPwdById[b.id]} />
                    </button>
                  </div>
                  <button onClick={() => verify(b)} className="btn-soft-primary w-full sm:w-auto shrink-0 whitespace-nowrap">
                    Verificar
                  </button>
                </div>
              )}
            </li>
          );
        })}

        {empty && (
          <div className="glass-strong border-dashed p-10 text-center text-neutral-500">
            Aún no hay proyectos. Crea el primero arriba.
          </div>
        )}
      </ul>

      <style>{`
        .hide-native-eye::-ms-reveal,
        .hide-native-eye::-ms-clear { display: none !important; }
      `}</style>

    </div>
  );
}

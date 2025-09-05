import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listenBoards, createBoardWithPassword, renameBoard, deleteBoardHard,
  checkBoardPassword
} from "../../services/boardService.js";

type Board = {
  id: string;
  name: string;
  locked?: boolean;
  createdAt?: any;
};

export default function ProjectList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdById, setPwdById] = useState<Record<string, string>>({});
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    const off = listenBoards((bs) => setBoards(bs as Board[]));
    return () => off && off();
  }, []);

  async function create() {
    if (!name.trim()) return;
    const id = await createBoardWithPassword(name.trim(), pwd.trim());
    setName(""); setPwd("");
    navigate(`/apps/kanban?b=${id}`);
  }

  async function open(b: Board) {
    if (b.locked && !unlockedIds.has(b.id)) {
      alert("Este proyecto está protegido. Verifícalo primero.");
      return;
    }
    navigate(`/apps/kanban?b=${b.id}`);
  }

  async function verify(b: Board) {
    const pass = pwdById[b.id] || "";
    const ok = await checkBoardPassword(b.id, pass);
    if (!ok) { alert("Contraseña incorrecta"); return; }
    const s = new Set(unlockedIds); s.add(b.id); setUnlockedIds(s);
    setPwdById((p) => ({ ...p, [b.id]: "" }));
  }

  const empty = useMemo(() => boards.length === 0, [boards.length]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Proyectos</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Gestiona tableros en Firestore (realtime).
        </p>
      </header>

      <div className="mb-6 grid gap-2 sm:grid-cols-[1fr_280px_auto]">
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
            className="input-plain pr-10 w-full"
          />
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            className="absolute inset-y-0 right-2 my-auto text-sm text-neutral-500 hover:text-neutral-300"
            title={showPwd ? "Ocultar" : "Mostrar"}
          >
            {showPwd ? "🙈" : "👁️"}
          </button>
        </div>
        <button onClick={create} className="btn-soft-elev">Crear</button>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {boards.map((b) => {
          const locked = !!b.locked;
          const isUnlocked = unlockedIds.has(b.id);
          const disabled = locked && !isUnlocked;

          return (
            <li key={b.id} className="glass-strong p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2">
                <input
                  defaultValue={b.name}
                  onBlur={(e) => renameBoard(b.id, e.target.value)}
                  className="input-plain flex-1 bg-transparent px-2 py-1 dark:bg-transparent dark:ring-neutral-800"
                />
                <button
                  disabled={disabled}
                  onClick={() => open(b)}
                  className={`btn-soft-primary ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={disabled ? "Verifica la contraseña" : "Abrir"}
                >
                  Abrir
                </button>
                <button
                  disabled={false}
                  onClick={() => { if (confirm(`¿Eliminar "${b.name}"?`)) deleteBoardHard(b.id); }}
                  className="btn-soft-danger"
                >
                  Borrar
                </button>
              </div>

              {locked && !isUnlocked && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="password"
                    placeholder="Contraseña del proyecto"
                    value={pwdById[b.id] || ""}
                    onChange={(e) => setPwdById(p => ({ ...p, [b.id]: e.target.value }))}
                    className="input-plain flex-1"
                    onKeyDown={(e) => { if (e.key === "Enter") verify(b); }}
                  />
                  <button onClick={() => verify(b)} className="btn-soft-primary">Verificar</button>
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
    </div>
  );
}

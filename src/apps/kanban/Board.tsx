import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  listenLists, listenCards, ensureDefaultLists,
  createCard, updateCardPosition, updateCardFields, deleteCard
} from "../../services/boardService.js";

const LAYOUT = [
  { id: "todo",       title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done",       title: "Done" },
];

function computeOrder(prev?: number | null, next?: number | null) {
  const GAP = 1024;
  if (prev == null && next == null) return GAP;
  if (prev == null) return (next as number) - GAP;
  if (next == null) return (prev as number) + GAP;
  return (prev + next) / 2;
}

export default function Board() {
  const [sp] = useSearchParams();
  const boardId = sp.get("b") || "";

  const [lists, setLists] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);

  // Formulario (como tu UI anterior)
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState<number>(0);
  const [assignee, setAssignee] = useState("");

  // Suscripciones
  useEffect(() => {
    if (!boardId) return;
    // cura tableros viejos y asegura las 3 listas
    ensureDefaultLists(boardId);
    const off1 = listenLists(boardId, setLists);
    const off2 = listenCards(boardId, setCards);
    return () => { off1 && off1(); off2 && off2(); };
  }, [boardId]);

  // Mapas
  const listMap = useMemo(() => {
    const m: Record<string, any> = {};
    for (const l of lists) m[l.id] = l;
    return m;
  }, [lists]);

  const cardsByList = useMemo(() => {
    const m: Record<string, any[]> = { todo: [], inprogress: [], done: [] };
    for (const c of cards) {
      if (m[c.listId]) m[c.listId].push(c);
    }
    for (const k of Object.keys(m)) m[k].sort((a, b) => a.order - b.order);
    return m;
  }, [cards]);

  if (!boardId) return <div className="p-6">Sin boardId (?b=)</div>;

  async function addTask() {
    const listId = "todo";
    const prev = cardsByList[listId][cardsByList[listId].length - 1]?.order ?? null;
    const newOrder = computeOrder(prev, null);
    await createCard(boardId, listId, title.trim() || "Nueva tarea", newOrder, "", Number(hours) || 0, assignee.trim());
    setTitle(""); setHours(0); setAssignee("");
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Proyecto</h1>
        <Link to="/apps/kanban" className="btn-soft-elev">← Volver a Proyectos</Link>
      </div>

      {/* Formulario superior */}
      <div className="mt-6 grid gap-3">
        <input
          className="input-plain"
          placeholder="Título de la tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input-plain"
          placeholder="Horas"
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        />
        <input
          className="input-plain"
          placeholder="Responsable"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        />
        <button className="btn-soft-elev" onClick={addTask}>Añadir tarea</button>
      </div>

      {/* Tres columnas fijas, responsive */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {LAYOUT.map((col, idx) => (
          <Column
            key={col.id}
            title={col.title}
            cards={cardsByList[col.id] || []}
            hasPrev={idx > 0}
            hasNext={idx < LAYOUT.length - 1}
            onEdit={(cardId, patch) => updateCardFields(boardId, cardId, patch)}
            onDelete={(cardId) => deleteCard(boardId, cardId)}
            onMoveLeft={async (cardId) => {
              if (!col.id || idx === 0) return;
              const targetId = LAYOUT[idx - 1].id;
              const newOrder = computeOrder(null, null);
              await updateCardPosition(boardId, cardId, targetId, newOrder);
            }}
            onMoveRight={async (cardId) => {
              if (!col.id || idx === LAYOUT.length - 1) return;
              const targetId = LAYOUT[idx + 1].id;
              const newOrder = computeOrder(null, null);
              await updateCardPosition(boardId, cardId, targetId, newOrder);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Column({
  title, cards, hasPrev, hasNext, onEdit, onDelete, onMoveLeft, onMoveRight
}: {
  title: string;
  cards: any[];
  hasPrev: boolean;
  hasNext: boolean;
  onEdit: (cardId: string, patch: any) => void;
  onDelete: (cardId: string) => void;
  onMoveLeft: (cardId: string) => void;
  onMoveRight: (cardId: string) => void;
}) {
  return (
    <section className="glass-strong rounded-xl p-4">
      <header className="flex items-center gap-2 mb-3">
        <h2 className="font-semibold">{title}</h2>
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600/20 px-2 text-xs">
          {cards.length}
        </span>
      </header>

      <div className="flex flex-col gap-3">
        {cards.map((c) => (
          <article key={c.id} className="rounded-xl bg-sky-900/40 p-4">
            <div className="font-semibold mb-3">{c.title}</div>

            <div className="grid gap-2 md:grid-cols-2 mb-3">
              <div>
                <label className="text-xs opacity-70 block mb-1">Horas</label>
                <input
                  className="input-plain"
                  type="number"
                  value={typeof c.hours === "number" ? c.hours : 0}
                  onChange={(e) => onEdit(c.id, { hours: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs opacity-70 block mb-1">Responsable</label>
                <input
                  className="input-plain"
                  value={c.assignee || ""}
                  onChange={(e) => onEdit(c.id, { assignee: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              {hasPrev && <button className="btn-soft-primary" onClick={() => onMoveLeft(c.id)}>‹ Mover</button>}
              {hasNext && <button className="btn-soft-primary" onClick={() => onMoveRight(c.id)}>Mover ›</button>}
              <button className="btn-soft-danger ml-auto" onClick={() => onDelete(c.id)}>Borrar</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

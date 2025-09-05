import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  listenLists,
  listenCards,
  createCard,
  createList,
  updateCardPosition,
} from "../../services/boardService.js"; // 👈 IMPORTA CON .js

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

  useEffect(() => {
    if (!boardId) return;
    const off1 = listenLists(boardId, setLists);
    const off2 = listenCards(boardId, setCards);
    return () => {
      off1 && off1();
      off2 && off2();
    };
  }, [boardId]);

  // Sembrar 3 listas si no hay ninguna
  useEffect(() => {
    if (!boardId) return;
    if (lists.length === 0) {
      (async () => {
        await createList(boardId, "To Do", 1024);
        await createList(boardId, "In Progress", 2048);
        await createList(boardId, "Done", 3072);
      })();
    }
  }, [boardId, lists.length]);

  const orderedLists = useMemo(
    () => [...lists].sort((a, b) => a.order - b.order),
    [lists]
  );

  const cardsByList = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const c of cards) (map[c.listId] ||= []).push(c);
    for (const k of Object.keys(map)) map[k].sort((a, b) => a.order - b.order);
    return map;
  }, [cards]);

  if (!boardId) return <div style={{ padding: 16 }}>Sin boardId (?b=)</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Proyecto</h2>
      <p>
        Comparte esta URL con <b>?b={boardId}</b> y todos verán/editarán lo
        mismo.
      </p>

      <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
        {orderedLists.map((list, idx) => (
          <Column
            key={list.id}
            boardId={boardId}
            list={list}
            cards={cardsByList[list.id] || []}
            prevListId={orderedLists[idx - 1]?.id}
            nextListId={orderedLists[idx + 1]?.id}
          />
        ))}
      </div>
    </div>
  );
}

function Column({
  boardId,
  list,
  cards,
  prevListId,
  nextListId,
}: {
  boardId: string;
  list: any;
  cards: any[];
  prevListId?: string;
  nextListId?: string;
}) {
  const [title, setTitle] = useState("");

  async function addCard() {
    if (!title.trim()) return;
    const prev = cards[cards.length - 1]?.order ?? null;
    const newOrder = computeOrder(prev, null);
    await createCard(boardId, list.id, title.trim(), newOrder);
    setTitle("");
  }

  async function move(card: any, destListId: string) {
    const newOrder = computeOrder(null, null); // al final
    await updateCardPosition(boardId, card.id, destListId, newOrder);
  }

  return (
    <div
      style={{
        minWidth: 300,
        background: "#0f172a33",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <h3 style={{ marginTop: 0 }}>{list.title}</h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          placeholder="Título de la tarea…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addCard}>Añadir</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              background: "#111827",
              color: "#fff",
              borderRadius: 8,
              padding: 10,
            }}
          >
            <div style={{ fontWeight: 600 }}>{card.title}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {prevListId && (
                <button onClick={() => move(card, prevListId)}>← Mover</button>
              )}
              {nextListId && (
                <button onClick={() => move(card, nextListId)}>Mover →</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

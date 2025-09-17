import { useEffect, useMemo, useState } from "react";
import {
  createCard,
  listenLists,
  listenCards,
  updateCardPosition,
} from "../services/boardService";

// Cálculo de order (para insertar entre vecinos)
function computeOrder(prev, next) {
  const GAP = 1024;
  if (prev == null && next == null) return GAP;
  if (prev == null) return next - GAP;
  if (next == null) return prev + GAP;
  return (prev + next) / 2;
}


export default function KanbanFireTest({ initialBoardId = null }) {
  const [boardId, setBoardId] = useState(
    initialBoardId ?? sessionStorage.getItem("boardId") ?? null
  );
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);

  // Suscripciones realtime SOLO si hay boardId verificado
  useEffect(() => {
    if (!boardId) return;
    const off1 = listenLists(boardId, setLists);
    const off2 = listenCards(boardId, setCards);
    return () => {
      off1 && off1();
      off2 && off2();
    };
  }, [boardId]);

  // Mapa de tarjetas por lista
  const cardsByList = useMemo(() => {
    const map = {};
    for (const c of cards) {
      map[c.listId] ??= [];
      map[c.listId].push(c);
    }
    Object.keys(map).forEach((k) => map[k].sort((a, b) => a.order - b.order));
    return map;
  }, [cards]);

  if (!boardId) {
    return (
      <div style={{ padding: 16 }}>
        Selecciona un proyecto verificado para continuar.
      </div>
    );
  }

  // Orden de listas por su "order" para render
  const orderedLists = [...lists].sort((a, b) => a.order - b.order);

  return (
    <div style={{ padding: 16 }}>
      <h2>Kanban Firestore</h2>

      <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
        {orderedLists.map((list, idx) => {
          const nextListId = orderedLists[idx + 1]?.id || null;
          const nextListCards = nextListId ? (cardsByList[nextListId] || []) : [];
          return (
            <Column
              key={list.id}
              boardId={boardId}
              list={list}
              cards={cardsByList[list.id] || []}
              nextListId={nextListId}
              nextListCards={nextListCards}
            />
          );
        })}
      </div>
    </div>
  );
}

function Column({ boardId, list, cards, nextListId, nextListCards }) {
  const [title, setTitle] = useState("");

  async function add() {
    if (!title.trim()) return;
    const prev = cards[cards.length - 1]?.order ?? null;
    const newOrder = computeOrder(prev, null);
    await createCard(boardId, list.id, title.trim(), newOrder);
    setTitle("");
  }

  // Mover al final de la siguiente lista (si existe), usando SUS tarjetas
  async function moveToNext(card) {
    if (!nextListId) return;
    const prevDest = nextListCards[nextListCards.length - 1]?.order ?? null;
    const newOrder = computeOrder(prevDest, null);
    await updateCardPosition(boardId, card.id, nextListId, newOrder);
  }

  return (
    <div style={{ minWidth: 280, background: "#f3f4f6", borderRadius: 12, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>{list.title}</h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          placeholder="Nueva tarjeta"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={add}>+ Añadir</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 10,
              boxShadow: "0 1px 2px rgba(0,0,0,.08)",
            }}
          >
            <div style={{ fontWeight: 600 }}>{card.title}</div>
            {nextListId && (
              <button
                style={{ marginTop: 6 }}
                onClick={() => moveToNext(card)}
                title="Mover a la siguiente lista"
              >
                → Mover
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

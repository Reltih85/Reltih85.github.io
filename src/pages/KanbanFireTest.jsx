import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  createBoard,
  createList,
  createCard,
  listenLists,
  listenCards,
  updateCardPosition,
  joinBoard,
} from "../services/boardService";

// Cálculo de order (para insertar entre vecinos)
function computeOrder(prev, next) {
  const GAP = 1024;
  if (prev == null && next == null) return GAP;
  if (prev == null) return next - GAP;
  if (next == null) return prev + GAP;
  return (prev + next) / 2;
}

export default function KanbanFireTest() {
  const [boardId, setBoardId] = useState(
    new URLSearchParams(location.search).get("b")
  );
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);

  // 1) Crear board si no hay ?b= en la URL
  useEffect(() => {
    (async () => {
      if (boardId) return;
      const id = await createBoard("Demo Firestore");
      // 3 listas base
      await createList(id, "Por hacer", 1024);
      await createList(id, "En progreso", 2048);
      await createList(id, "Hecho", 3072);
      const url = new URL(location.href);
      url.searchParams.set("b", id);
      history.replaceState({}, "", url.toString());
      setBoardId(id);
    })();
  }, [boardId]);

  // 2) Auto-join: agregar al visitante a members del board
  useEffect(() => {
    if (!boardId) return;
    const off = onAuthStateChanged(auth, (user) => {
      if (user) joinBoard(boardId);
    });
    return () => off();
  }, [boardId]);

  // 3) Suscripciones realtime
  useEffect(() => {
    if (!boardId) return;
    const off1 = listenLists(boardId, setLists);
    const off2 = listenCards(boardId, setCards);
    return () => {
      off1 && off1();
      off2 && off2();
    };
  }, [boardId]);

  // 4) Mapa de tarjetas por lista
  const cardsByList = useMemo(() => {
    const map = {};
    for (const c of cards) {
      map[c.listId] ??= [];
      map[c.listId].push(c);
    }
    Object.keys(map).forEach((k) => map[k].sort((a, b) => a.order - b.order));
    return map;
  }, [cards]);

  if (!boardId) return <div style={{ padding: 16 }}>Creando tablero…</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Kanban Firestore (demo) — board: {boardId}</h2>
      <p>
        Comparte esta URL con <strong>?b={boardId}</strong> y se sincroniza en
        otras PCs al instante.
      </p>

      <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
        {lists.sort((a, b) => a.order - b.order).map((list) => (
          <Column
            key={list.id}
            boardId={boardId}
            list={list}
            cards={cardsByList[list.id] || []}
          />
        ))}
      </div>
    </div>
  );
}

function Column({ boardId, list, cards }) {
  const [title, setTitle] = useState("");

  async function add() {
    if (!title.trim()) return;
    const prev = cards[cards.length - 1]?.order;
    const newOrder = computeOrder(prev, null);
    await createCard(boardId, list.id, title.trim(), newOrder);
    setTitle("");
  }

  // Mover a la siguiente lista (simple)
  async function moveToNext(card, nextListId) {
    const nextCards = []; // en esta demo, insertamos al final
    const prev = nextCards[nextCards.length - 1]?.order;
    const newOrder = computeOrder(prev, null);
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
          <div key={card.id} style={{ background: "#fff", borderRadius: 8, padding: 10, boxShadow: "0 1px 2px rgba(0,0,0,.08)" }}>
            <div style={{ fontWeight: 600 }}>{card.title}</div>
            {/* Botón “mover” simple: a la siguiente lista si existe */}
            <MoveButtons boardId={boardId} currentListId={list.id} card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MoveButtons({ boardId, currentListId, card }) {
  // Para la demo: ids predecibles por título de lista (en producción, trae las listas del contexto)
  // Aquí omitimos por simplicidad; en tu Board real, puedes mostrar botones según el orden de listas.
  return null;
}

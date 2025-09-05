import { useEffect, useMemo, useState } from "react";
import { listenLists, listenCards } from "../services/boardService";

export function useBoard(boardId) {
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (!boardId) return;
    const off1 = listenLists(boardId, setLists);
    const off2 = listenCards(boardId, setCards);
    return () => { off1 && off1(); off2 && off2(); };
  }, [boardId]);

  const cardsByList = useMemo(() => {
    const map = {};
    for (const c of cards) {
      map[c.listId] ??= [];
      map[c.listId].push(c);
    }
    Object.keys(map).forEach(k => map[k].sort((a,b)=>a.order-b.order));
    return map;
  }, [cards]);

  return { lists: [...lists].sort((a,b)=>a.order-b.order), cardsByList };
}

export function computeOrder(prev, next) {
  const GAP = 1024;
  if (prev == null && next == null) return GAP;
  if (prev == null) return next - GAP;
  if (next == null) return prev + GAP;
  return (prev + next) / 2;
}

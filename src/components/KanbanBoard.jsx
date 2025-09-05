import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useBoard, computeOrder } from "../hooks/useBoard";
import { updateCardPosition, createList, createCard } from "../services/boardService";
import { useState } from "react";

export default function KanbanBoard({ boardId }) {
  const { lists, cardsByList } = useBoard(boardId);
  const [newListTitle, setNewListTitle] = useState("");

  async function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const toListId = destination.droppableId;
    const toCards = cardsByList[toListId] ?? [];
    const toIndex = destination.index;

    const prev = toCards[toIndex - 1]?.order;
    const next = toCards[toIndex]?.order;
    const newOrder = computeOrder(prev, next);

    await updateCardPosition(boardId, draggableId, toListId, newOrder);
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Nueva lista"
          value={newListTitle}
          onChange={e=>setNewListTitle(e.target.value)}
        />
        <button onClick={()=>{ if(newListTitle.trim()) { createList(boardId, newListTitle.trim()); setNewListTitle(""); }}}>
          + Lista
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
          {lists.map(list => {
            const listCards = cardsByList[list.id] ?? [];
            return (
              <div key={list.id} style={{ minWidth: 260, background: "#f3f4f6", borderRadius: 12, padding: 12 }}>
                <h3 style={{ margin: 0, marginBottom: 8 }}>{list.title}</h3>
                <AddCard boardId={boardId} listId={list.id} />
                <Droppable droppableId={list.id} type="CARD">
                  {(prov) => (
                    <div ref={prov.innerRef} {...prov.droppableProps} style={{ display:"flex", flexDirection:"column", gap:8, minHeight:20 }}>
                      {listCards.map((card, idx) => (
                        <Draggable draggableId={card.id} index={idx} key={card.id}>
                          {(prov2) => (
                            <div ref={prov2.innerRef} {...prov2.draggableProps} {...prov2.dragHandleProps}
                              style={{ background:"#fff", borderRadius:8, padding:10, boxShadow:"0 1px 2px rgba(0,0,0,.08)" }}>
                              <div style={{ fontWeight: 600 }}>{card.title}</div>
                              {card.description && <div style={{ fontSize:12, color:"#6b7280" }}>{card.description}</div>}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {prov.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

function AddCard({ boardId, listId }) {
  const [title, setTitle] = useState("");
  return (
    <div style={{ display:"flex", gap:8, marginBottom:8 }}>
      <input placeholder="Nueva tarjeta" value={title} onChange={e=>setTitle(e.target.value)} />
      <button onClick={()=>{ if(title.trim()) { createCard(boardId, listId, title.trim()); setTitle(""); }}}>
        + Tarjeta
      </button>
    </div>
  );
}

// src/services/boardService.js
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  arrayUnion,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../lib/firebase";

/** Espera un uid listo (auth anónima incluida) */
async function getUid() {
  if (auth.currentUser?.uid) return auth.currentUser.uid;
  return await new Promise((resolve) => {
    const off = onAuthStateChanged(auth, (u) => {
      off();
      resolve(u?.uid || null);
    });
  });
}

/** Crea un board y devuelve su ID */
export async function createBoard(name) {
  const uid = await getUid();
  const boardRef = doc(collection(db, "boards"));
  await setDoc(boardRef, {
    name: name || "Proyecto",
    ownerUid: uid || null,
    members: uid ? [uid] : [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return boardRef.id;
}

/** Auto-join: agrega al usuario a members (idempotente) */
export async function joinBoard(boardId) {
  const uid = await getUid();
  if (!uid || !boardId) return;
  await updateDoc(doc(db, "boards", boardId), { members: arrayUnion(uid) });
}

/** Realtime: listas del board */
export function listenLists(boardId, cb) {
  const q = query(
    collection(db, "boards", boardId, "lists"),
    orderBy("order", "asc")
  );
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

/** Realtime: tarjetas del board */
export function listenCards(boardId, cb) {
  const q = query(
    collection(db, "boards", boardId, "cards"),
    orderBy("order", "asc")
  );
  return onSnapshot(q, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

/** Crear lista */
export async function createList(boardId, title, order = 1024) {
  await addDoc(collection(db, "boards", boardId, "lists"), {
    title: title || "Nueva lista",
    order,
    createdAt: serverTimestamp(),
  });
}

/** Crear tarjeta */
export async function createCard(boardId, listId, title, order = 1024, description = "") {
  await addDoc(collection(db, "boards", boardId, "cards"), {
    title: title || "Nueva tarjeta",
    description,
    listId,
    order,
    createdAt: serverTimestamp(),
  });
}

/** Mover tarjeta / cambiar orden */
export async function updateCardPosition(boardId, cardId, toListId, newOrder) {
  const ref = doc(db, "boards", boardId, "cards", cardId);
  await updateDoc(ref, {
    listId: toListId,
    order: newOrder,
    updatedAt: serverTimestamp(),
  });
}

/** Lectura única: tarjetas de una lista */
export async function getCardsByList(boardId, listId) {
  const q = query(
    collection(db, "boards", boardId, "cards"),
    where("listId", "==", listId),
    orderBy("order", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Mapear nombre de proyecto → boardId (no guarda datos, solo el id) */
export async function getOrCreateBoardIdByName(name) {
  const key = `boardId:${name}`;
  let id = localStorage.getItem(key);
  if (id) return id;

  id = await createBoard(name || "Proyecto");
  // semillas
  await createList(id, "To Do", 1024);
  await createList(id, "In Progress", 2048);
  await createList(id, "Done", 3072);

  localStorage.setItem(key, id);
  return id;
}

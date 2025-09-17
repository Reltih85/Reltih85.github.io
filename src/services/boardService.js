import {
  addDoc, collection, doc, getDoc, onSnapshot, query, orderBy,
  serverTimestamp, setDoc, updateDoc, deleteDoc, getDocs
} from "firebase/firestore";
import { db } from "../lib/firebase";

/* --- helpers de contraseña (opcional) --- */
function randomSalt(n = 16) {
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < n; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return s;
}
async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

/* -------- BOARDS (colección: boards) -------- */
export function listenBoards(cb) {
  // sin orderBy en Firestore; ordenamos en cliente para evitar parpadeos
  const q = query(collection(db, "boards"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((b) => b?.name !== "_ping_")
      .sort((a, b) => {
        const ta = (a.updatedAt?.toMillis?.() ?? a.createdAt?.toMillis?.() ?? 0);
        const tb = (b.updatedAt?.toMillis?.() ?? b.createdAt?.toMillis?.() ?? 0);
        return tb - ta; // más reciente primero
      });
    cb(items);
  });
}


/** Asegura las 3 listas con IDs fijos (idempotente) */
export async function ensureDefaultLists(boardId) {
  const base = [
    { id: "todo",        title: "To Do",       order: 1024 },
    { id: "inprogress",  title: "In Progress", order: 2048 },
    { id: "done",        title: "Done",        order: 3072 },
  ];
  for (const l of base) {
    await setDoc(
      doc(db, "boards", boardId, "lists", l.id),
      { title: l.title, order: l.order, createdAt: serverTimestamp() },
      { merge: true }  // no duplica
    );
  }
}

export async function createBoardWithPassword(name, password = "") {
  const cleanName = (name || "").trim();
  if (!cleanName) throw new Error("El proyecto necesita un nombre.");
  if (cleanName === "_ping_") throw new Error("El nombre '_ping_' está reservado.");

  const ref = doc(collection(db, "boards"));

  const hasPwd = !!(password && password.trim());

  const payload = {
    name: cleanName,
    locked: hasPwd,                    // público si false, privado si true
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (hasPwd) {
    const salt = randomSalt(16);
    const hash = await sha256Hex(`${salt}${password}`);
    payload.passwordSalt = salt;
    payload.passwordHash = hash;
  }

  await setDoc(ref, payload);
  await ensureDefaultLists(ref.id);
  return ref.id;
}


export async function renameBoard(boardId, newName) {
  const clean = (newName || "").trim();
  if (!clean || clean === "_ping_") return;
  await updateDoc(doc(db, "boards", boardId), {
    name: clean,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBoardHard(boardId) {
  const listsSnap = await getDocs(collection(db, "boards", boardId, "lists"));
  for (const d of listsSnap.docs) {
    await deleteDoc(doc(db, "boards", boardId, "lists", d.id));
  }
  const cardsSnap = await getDocs(collection(db, "boards", boardId, "cards"));
  for (const d of cardsSnap.docs) {
    await deleteDoc(doc(db, "boards", boardId, "cards", d.id));
  }
  await deleteDoc(doc(db, "boards", boardId));
}

export async function checkBoardPassword(boardId, password) {
  const snap = await getDoc(doc(db, "boards", boardId));
  const data = snap.data();
  if (!data?.locked) return true;
  const hash = await sha256Hex(`${data.passwordSalt || ""}${password}`);
  return hash === data.passwordHash;
}

/* -------- LISTS & CARDS -------- */
export function listenLists(boardId, cb) {
  const q = query(collection(db, "boards", boardId, "lists"), orderBy("order", "asc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
export function listenCards(boardId, cb) {
  const q = query(collection(db, "boards", boardId, "cards"), orderBy("order", "asc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
export async function createList(boardId, title, order = 1024) {
  await setDoc(
    doc(collection(db, "boards", boardId, "lists")),
    { title: title || "Nueva lista", order, createdAt: serverTimestamp() }
  );
}
export async function createCard(
  boardId, listId, title, order = 1024, description = "", hours = 0, assignee = ""
) {
  await addDoc(collection(db, "boards", boardId, "cards"), {
    title: title || "Nueva tarjeta",
    description,
    listId,
    order,
    hours,
    assignee,
    createdAt: serverTimestamp(),
  });
}
export async function updateCardPosition(boardId, cardId, toListId, newOrder) {
  const ref = doc(db, "boards", boardId, "cards", cardId);
  await updateDoc(ref, { listId: toListId, order: newOrder, updatedAt: serverTimestamp() });
}
export async function updateCardFields(boardId, cardId, data) {
  const ref = doc(db, "boards", boardId, "cards", cardId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}
export async function deleteCard(boardId, cardId) {
  await deleteDoc(doc(db, "boards", boardId, "cards", cardId));
}

/* -------- Alias (compatibilidad) -------- */
export async function getOrCreateBoardIdByName(name) {
  const id = await createBoardWithPassword(name, "");
  return id;
}
export async function createBoard(name) {
  return createBoardWithPassword(name, "");
}

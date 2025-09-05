import {
  addDoc, collection, doc, getDoc, onSnapshot, orderBy, query,
  serverTimestamp, setDoc, updateDoc, arrayUnion, deleteDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../lib/firebase";

/* ---------------- helpers ---------------- */
async function getUid() {
  if (auth.currentUser?.uid) return auth.currentUser.uid;
  return await new Promise((res) => {
    const off = onAuthStateChanged(auth, (u) => { off(); res(u?.uid || null); });
  });
}
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

/* ------------- Boards (colección: boards) ------------- */
export function listenBoards(cb) {
  const q = query(collection(db, "boards"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
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
      { merge: true } // no duplica; solo asegura
    );
  }
}

export async function createBoardWithPassword(name, password = "") {
  const uid = await getUid();
  const ref = doc(collection(db, "boards"));
  const salt = password ? randomSalt(16) : null;
  const passwordHash = password ? await sha256Hex(`${salt}${password}`) : null;

  await setDoc(ref, {
    name: name || "Proyecto",
    ownerUid: uid || null,
    members: uid ? [uid] : [],
    locked: !!password,
    passwordSalt: salt,
    passwordHash,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 👇 listas fijas
  await ensureDefaultLists(ref.id);

  return ref.id;
}

export async function renameBoard(boardId, newName) {
  await updateDoc(doc(db, "boards", boardId), { name: newName, updatedAt: serverTimestamp() });
}
export async function deleteBoardHard(boardId) {
  await deleteDoc(doc(db, "boards", boardId));
}
export async function checkBoardPassword(boardId, password) {
  const snap = await getDoc(doc(db, "boards", boardId));
  const data = snap.data();
  if (!data?.locked) return true;
  const hash = await sha256Hex(`${data.passwordSalt || ""}${password}`);
  return hash === data.passwordHash;
}
export async function joinBoard(boardId) {
  const uid = await getUid();
  if (!uid || !boardId) return;
  await updateDoc(doc(db, "boards", boardId), { members: arrayUnion(uid) });
}

/* ------------- Listas y Tarjetas ------------- */
export function listenLists(boardId, cb) {
  const q = query(collection(db, "boards", boardId, "lists"), orderBy("order", "asc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
export function listenCards(boardId, cb) {
  const q = query(collection(db, "boards", boardId, "cards"), orderBy("order", "asc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
export async function createList(boardId, title, order = 1024) {
  await addDoc(collection(db, "boards", boardId, "lists"), {
    title: title || "Nueva lista",
    order,
    createdAt: serverTimestamp(),
  });
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

/* ------------- Util ------------- */
export async function getOrCreateBoardIdByName(name) {
  const key = `boardId:${name}`;
  let id = localStorage.getItem(key);
  if (id) return id;
  id = await createBoardWithPassword(name, "");
  localStorage.setItem(key, id);
  return id;
}
/** Alias para compatibilidad con código viejo */
export async function createBoard(name) {
  return createBoardWithPassword(name, "");
}

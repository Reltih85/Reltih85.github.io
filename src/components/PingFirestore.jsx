// src/components/PingFirestore.jsx
import { useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function PingFirestore() {
  useEffect(() => {
    const off = onAuthStateChanged(auth, async (user) => {
      if (!user) return; // si Auth fallara, no hace nada
      try {
        // Escribe en /boards (ruta que tus rules SÍ permiten "create" con usuario autenticado)
        const ref = doc(collection(db, "boards"));
        await setDoc(ref, {
          name: "__ping__",
          ownerUid: user.uid,
          members: [user.uid],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          _test: true,
        });
        console.log("Firestore OK. Doc:", ref.id);
      } catch (e) {
        console.error("Ping Firestore error:", e);
      }
    });
    return () => off();
  }, []);

  return null; // 👈 nada en la UI
}

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function PingFirestore() {
  const [status, setStatus] = useState("Esperando…");

  useEffect(() => {
    const off = onAuthStateChanged(auth, async (user) => {
      if (!user) return setStatus("Sin usuario (auth falló)");
      try {
        const ref = await addDoc(collection(db, "debug"), {
          uid: user.uid,
          at: serverTimestamp(),
        });
        setStatus("OK Firestore: " + ref.id);
      } catch (e) {
        setStatus("Error: " + (e?.code || e?.message));
        console.error(e);
      }
    });
    return () => off();
  }, []);

  return <div style={{ padding: 8, fontSize: 12 }}>Ping: {status}</div>;
}

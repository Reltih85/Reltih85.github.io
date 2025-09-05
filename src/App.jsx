import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PingFirestore from "@/components/PingFirestore"; // <- ruta desde /src

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Debug: quítalo cuando confirmes que Firestore escribe */}
      <PingFirestore />

      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

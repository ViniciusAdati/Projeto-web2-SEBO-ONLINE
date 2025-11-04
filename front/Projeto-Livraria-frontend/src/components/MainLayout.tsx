// src/components/MainLayout.tsx
// (CRIE ESTE NOVO ARQUIVO)

import { useState } from "react";
import { Outlet } from "react-router-dom"; // Importa o Outlet
import { Navbar } from "./Navbar";
import { ChatSidebar } from "./ChatSidebar";

export function MainLayout() {
  // 1. O estado do sidebar de chat agora vive aqui
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);

  // 2. A função para controlar o estado vive aqui
  const toggleChatSidebar = () => {
    setIsChatSidebarOpen((prev) => !prev);
  };

  return (
    <div className="layout-container">
      {/* 3. A Navbar é renderizada aqui e recebe a função REAL */}
      <Navbar onChatIconClick={toggleChatSidebar} />

      {/* 4. O Outlet renderiza a página da rota atual (Home, Estante, etc.) */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* 5. O ChatSidebar é renderizado aqui e controlado pelo estado local */}
      {isChatSidebarOpen && <ChatSidebar onClose={toggleChatSidebar} />}
    </div>
  );
}

// Opcional: Adicione um CSS básico para .main-content se necessário
// ex: .main-content { padding: 20px; }

// src/pages/HomePage.tsx
// (SUBSTITUA O SEU ARQUIVO POR ESTE)

import { useState, useEffect } from "react";
// REMOVIDO: import { Navbar } from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import MatchList from "../components/MatchList";
import { CommunityList } from "../components/CommunityList";
// REMOVIDO: import { ChatSidebar } from "../components/ChatSidebar";
import api from "../services/api";

import "../styles/HomePage.css";

interface CommunityUser {
  id: number;
  name: string;
  totalLivros: number;
  // avatarUrl?: string;
}

export function HomePage() {
  const [communityUsers, setCommunityUsers] = useState<CommunityUser[]>([]);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [errorCommunity, setErrorCommunity] = useState<string | null>(null);

  // REMOVIDO: const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  // REMOVIDO: const toggleChatSidebar = () => { ... };

  useEffect(() => {
    const fetchCommunityUsers = async () => {
      try {
        setLoadingCommunity(true);
        setErrorCommunity(null);
        const response = await api.get<CommunityUser[]>("/users/community");
        setCommunityUsers(response.data);
      } catch (err) {
        console.error("Erro ao buscar usuários da comunidade:", err);
        setErrorCommunity("Não foi possível carregar a lista da comunidade.");
      } finally {
        setLoadingCommunity(false);
      }
    };
    fetchCommunityUsers();
  }, []);

  return (
    // A div "homepage-layout" pode ser mantida ou removida,
    // já que o <main> agora está no MainLayout
    <div className="homepage-layout">
      {/* REMOVIDO: <Navbar onChatIconClick={toggleChatSidebar} /> */}

      <main className="dashboard-content">
        <h1 className="dashboard-title">Dashboard de Matches</h1>
        <p className="dashboard-subtitle">
          Encontre trocas perfeitas para sua coleção
        </p>

        <SummaryCards />

        <div className="dashboard-grid">
          <section className="main-column">
            <MatchList />
          </section>

          <aside className="sidebar-column">
            {loadingCommunity && <p>Carregando comunidade...</p>}
            {errorCommunity && <p style={{ color: "red" }}>{errorCommunity}</p>}
            {!loadingCommunity && !errorCommunity && (
              <CommunityList users={communityUsers} />
            )}
          </aside>
        </div>
      </main>

      {/* REMOVIDO: {isChatSidebarOpen && <ChatSidebar onClose={toggleChatSidebar} />} */}
    </div>
  );
}

export default HomePage;

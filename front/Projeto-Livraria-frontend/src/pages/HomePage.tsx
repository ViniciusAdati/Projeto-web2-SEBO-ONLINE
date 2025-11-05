// src/pages/HomePage.tsx

import { useState, useEffect } from "react";
// import { Navbar } from "../components/Navbar"; // <-- REMOVIDO (Corrigido da última vez)
import SummaryCards from "../components/SummaryCards";
// import MatchList from "../components/MatchList"; // <-- REMOVIDO
import { CommunityList } from "../components/CommunityList"; 
import api from "../services/api"; 
import "../styles/HomePage.css"; 

// --- NOVO ---
// Importa a lista de livros que acabamos de criar
import { RecentBooksList } from "../components/RecentBooksList"; 
// --- FIM NOVO ---

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

  useEffect(() => {
    const fetchCommunityUsers = async () => {
      try {
        setLoadingCommunity(true);
        setErrorCommunity(null);
        const response = await api.get<CommunityUser[]>("/users/community"); 
        setCommunityUsers(response.data);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        setErrorCommunity("Não foi possível carregar a comunidade.");
      } finally {
        setLoadingCommunity(false);
      }
    };
    fetchCommunityUsers();
  }, []);

  return (
    <div className="homepage-layout">
      {/* <Navbar ... /> <-- REMOVIDO */}

      <main className="dashboard-content">
        <h1 className="dashboard-title">Dashboard de Matches</h1>
        <p className="dashboard-subtitle">
          Encontre trocas perfeitas para sua coleção
        </p>
        <SummaryCards />
        <div className="dashboard-grid">
          
          {/* --- ALTERAÇÃO AQUI --- */}
          {/* A coluna principal agora mostra os livros recentes */}
          <section className="main-column">
            <RecentBooksList /> 
          </section>
          {/* --- FIM DA ALTERAÇÃO --- */}

          <aside className="sidebar-column">
            {loadingCommunity && <p>Carregando comunidade...</p>}
            {errorCommunity && <p style={{ color: 'red' }}>{errorCommunity}</p>}
            {!loadingCommunity && !errorCommunity && (
              <CommunityList users={communityUsers} /> 
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
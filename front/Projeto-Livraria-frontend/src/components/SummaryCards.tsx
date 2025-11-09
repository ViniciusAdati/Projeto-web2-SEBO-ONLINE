import React, { useState, useEffect } from "react";
import SummaryCard from "./SummaryCard";
import { BsBoxes, BsBookmarkHeart, BsShuffle } from "react-icons/bs";
import { GiOpenBook } from "react-icons/gi";
import "../styles/SummaryCards.css";
import api from "../services/api";

// Interface para os dados que o backend vai enviar
interface DashboardStats {
  myCollectionCount: number;
  otherBooksCount: number;
  wishlistCount: number;
  chatsCount: number;
}

// Estado inicial (mostra 0 enquanto carrega)
const initialStats: DashboardStats = {
  myCollectionCount: 0,
  otherBooksCount: 0,
  wishlistCount: 0,
  chatsCount: 0,
};

const SummaryCards: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(initialStats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // --- [A CORREÇÃO ESTÁ AQUI] ---
        // Removemos o '/api' do início, pois o 'api.ts' já o adiciona.
        const response = await api.get<DashboardStats>("/stats/dashboard");

        setStats(response.data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas do dashboard:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="summary-cards-container">
      {/* Matches Disponíveis = Livros dos Outros */}
      <SummaryCard
        title="Matches Disponíveis"
        value={stats.otherBooksCount}
        Icon={BsShuffle}
      />

      {/* Minha Coleção = Meus Livros */}
      <SummaryCard
        title="Minha Coleção"
        value={stats.myCollectionCount}
        Icon={GiOpenBook}
      />

      {/* Lista de Desejos = Total de Favoritos */}
      <SummaryCard
        title="Lista de Desejos"
        value={stats.wishlistCount}
        Icon={BsBookmarkHeart}
      />

      {/* Trocas Ativas = Meus Chats */}
      <SummaryCard
        title="Trocas Ativas"
        value={stats.chatsCount}
        Icon={BsBoxes}
      />
    </div>
  );
};

export default SummaryCards;

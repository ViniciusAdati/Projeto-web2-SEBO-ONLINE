import React from 'react'
import { BsBook, BsHeart, BsSearch } from 'react-icons/bs'
import '../styles/Sidebar.css'

const QuickActions: React.FC = () => {
  return (
    <div className="sidebar-block quick-actions">
      <h3>Ações Rápidas</h3>
      <button className="action-button primary">
        <BsBook /> Adicionar à Coleção
      </button>
      <button className="action-button secondary">
        <BsHeart /> Adicionar aos Desejos
      </button>
      <button className="action-button tertiary">
        <BsSearch /> Buscar Usuários
      </button>
    </div>
  )
}

export default QuickActions

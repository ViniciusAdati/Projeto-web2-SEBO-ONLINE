import React from 'react'
import SummaryCard from './SummaryCard'
import { BsBoxes, BsBookmarkHeart, BsShuffle } from 'react-icons/bs'
import { GiOpenBook } from 'react-icons/gi'
import '../styles/SummaryCards.css'

const SummaryCards: React.FC = () => {
  return (
    <div className="summary-cards-container">
      <SummaryCard title="Matches Disponíveis" value={24} Icon={BsShuffle} />
      <SummaryCard title="Minha Coleção" value={156} Icon={GiOpenBook} />
      <SummaryCard title="Lista de Desejos" value={43} Icon={BsBookmarkHeart} />
      <SummaryCard title="Trocas Ativas" value={7} Icon={BsBoxes} />
    </div>
  )
}

export default SummaryCards

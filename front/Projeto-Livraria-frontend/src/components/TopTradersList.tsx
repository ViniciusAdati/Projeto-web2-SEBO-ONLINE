import React from 'react'
import { BsStarFill } from 'react-icons/bs'
import '../styles/Sidebar.css'

const TopTradersList: React.FC = () => {
  const traders = [
    { name: 'Rafael Silva', trades: 142, rating: 5 },
    { name: 'Lucia Ferreira', trades: 98, rating: 4.5 },
    { name: 'Marcos Oliveira', trades: 87, rating: 5 },
  ]

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const stars = []

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<BsStarFill key={i} className="star filled" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<BsStarFill key={i} className="star half" />)
      } else {
        stars.push(<BsStarFill key={i} className="star empty" />)
      }
    }
    return <div className="rating-stars">{stars}</div>
  }

  return (
    <div className="sidebar-block top-traders">
      <h3>Top Traders</h3>
      {traders.map((trader, index) => (
        <div key={index} className="trader-item">
          <img
            src={`/avatars/trader-${index + 1}.jpg`}
            alt={trader.name}
            className="trader-avatar"
          />
          <div className="trader-info">
            <p className="trader-name">{trader.name}</p>
            <p className="trader-trades">{trader.trades} trocas</p>
          </div>
          {renderStars(trader.rating)}
        </div>
      ))}
    </div>
  )
}

export default TopTradersList

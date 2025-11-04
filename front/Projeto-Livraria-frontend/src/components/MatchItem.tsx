import React from 'react'
import { BsGeoAltFill, BsStarFill } from 'react-icons/bs'
import '../styles/MatchItem.css'

interface MatchItemProps {
  user: {
    name: string
    location: string
    distance: string
    avatarUrl: string
    matchPercentage: number
    rating: number
    trades: number
    wantsBook: { title: string; image: string }
    offersBook: { title: string; image: string }
  }
}

const MatchItem: React.FC<MatchItemProps> = ({ user }) => {
  return (
    <div className="match-item-card">
      <div className="match-header">
        <img src={user.avatarUrl} alt={user.name} className="user-avatar" />
        <div className="user-info">
          <p className="user-name">{user.name}</p>
          <p className="user-location">
            <BsGeoAltFill /> {user.location} • {user.distance} de distância
          </p>
          <div className="user-stats">
            {Array(Math.floor(user.rating)).fill(
              <BsStarFill className="star-filled" />
            )}
            <span>
              {user.rating.toFixed(1)} ({user.trades} trocas)
            </span>
          </div>
        </div>
        <div
          className="match-percentage"
          style={{
            backgroundColor: user.matchPercentage > 90 ? '#28a745' : '#ffc107',
          }}
        >
          {user.matchPercentage}% Match
        </div>
      </div>

      <div className="book-details">
        <div className="book-offer">
          <p className="offer-title">Ele tem o que quer:</p>
          <div className="book-card">
            <img
              src={user.offersBook.image}
              alt={user.offersBook.title}
              className="book-image"
            />
            <p>{user.offersBook.title}</p>
          </div>
        </div>

        <div className="book-want">
          <p className="want-title">Você tem o que ele quer:</p>
          <div className="book-card">
            <img
              src={user.wantsBook.image}
              alt={user.wantsBook.title}
              className="book-image"
            />
            <p>{user.wantsBook.title}</p>
          </div>
        </div>

        <button className="init-trade-button">Iniciar Troca</button>
      </div>
    </div>
  )
}

export default MatchItem

import React from 'react'
import MatchItem from './MatchItem'
import '../styles/MatchList.css'

const mockMatches = [
  {
    name: 'João Santos',
    location: 'São Paulo, SP',
    distance: '2.5km',
    avatarUrl: '/avatars/joao.jpg',
    matchPercentage: 97,
    rating: 4.9,
    trades: 23,
    wantsBook: { title: 'Batman: The Dark Knight', image: '/books/batman.jpg' },
    offersBook: {
      title: 'Amazing Spider-Man #1',
      image: '/books/spiderman.jpg',
    },
  },
  {
    name: 'Ana Costa',
    location: 'Rio de Janeiro, RJ',
    distance: '1.2km',
    avatarUrl: '/avatars/ana.jpg',
    matchPercentage: 89,
    rating: 4.7,
    trades: 15,
    wantsBook: {
      title: 'Harry Potter - Pedra Filosofal',
      image: '/books/harrypotter.jpg',
    },
    offersBook: { title: 'Wonder Woman #75', image: '/books/wonderwoman.jpg' },
  },
  // ... mais dados
]

const MatchList: React.FC = () => {
  return (
    <div className="match-list-container">
      <div className="match-list-header">
        <h3>Matches Sugeridos</h3>
        <select className="relevance-filter">
          <option>Mais Relevantes</option>
          <option>Mais Próximos</option>
          <option>Melhores Avaliados</option>
        </select>
      </div>
      <div className="match-items">
        {mockMatches.map((match, index) => (
          <MatchItem key={index} user={match} />
        ))}
      </div>
    </div>
  )
}

export default MatchList

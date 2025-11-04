import React from 'react'
import { BsCheckCircle, BsChatText, BsEnvelope } from 'react-icons/bs'
// CORRIGIDO: Este é o caminho correto para subir um nível (para 'src/')
// e entrar na pasta 'styles/' (irmã de 'components/').
import '../styles/Sidebar.css'

const RecentActivity: React.FC = () => {
  return (
    <div className="sidebar-block recent-activity">
      <h3>Atividade Recente</h3>
      <div className="activity-item success">
        <BsCheckCircle />
        <div>
          <p>Troca finalizada</p>
          <span>com Carlos Mendes • há 3h</span>
        </div>
      </div>
      <div className="activity-item info">
        <BsChatText />
        <div>
          <p>Nova mensagem</p>
          <span>de Ana Costa • há 1h</span>
        </div>
      </div>
      <div className="activity-item warning">
        <BsEnvelope />
        <div>
          <p>Novo match encontrado</p>
          <span>com João Santos • há 3h</span>
        </div>
      </div>
    </div>
  )
}

export default RecentActivity

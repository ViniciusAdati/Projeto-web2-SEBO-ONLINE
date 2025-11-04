import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotificationPopup.css";
// --- CORREÇÃO: Importa 'type { Notification }' do AuthContext ---
import type { Notification } from "../contexts/AuthContext";

interface NotificationPopupProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: () => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        onMarkAsRead(); // Zera o contador do badge
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [onMarkAsRead, notifications.length]);

  const handleNotificationClick = (negociacaoId: number) => {
    onClose();
    navigate(`/chat/${negociacaoId}`);
  };

  const formatTimeAgo = (timestamp: string): string => {
    if (!timestamp) return "agora";
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return `agora`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `há ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `há ${diffInHours} h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `há ${diffInDays} d`;
  };

  return (
    <div className="notification-popup">
      <div className="notification-popup-header">
        <h4>Notificações</h4>
      </div>
      <ul className="notification-list">
        {notifications.length === 0 && (
          <li className="no-notifications">Nenhuma notificação nova.</li>
        )}
        {/* --- CORREÇÃO (TS2339): Propriedades agora existem --- */}
        {notifications.map((notif) => (
          <li
            key={notif.id}
            onClick={() => handleNotificationClick(notif.negociacaoId)}
          >
            <div className="notification-content">
              <span className="sender-name">
                Nova mensagem de {notif.senderName}
              </span>
              <span className="timestamp">
                {formatTimeAgo(notif.timestamp)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

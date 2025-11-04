import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { FaBell, FaCommentDots, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { NotificationPopup } from "./NotificationPopup";

interface NavbarProps {
  onChatIconClick: () => void;
}

function useOutsideAlerter(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

export function Navbar({ onChatIconClick }: NavbarProps) {
  const navigate = useNavigate();
  // --- CORREÇÃO (TS2339): Pega 'markAsRead' ---
  const { user, logout, unreadCount, notifications, markAsRead } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
  const notificationPopupRef = useRef<HTMLDivElement>(null);

  useOutsideAlerter(dropdownRef, () => setDropdownOpen(false));
  useOutsideAlerter(notificationPopupRef, () =>
    setIsNotificationPopupOpen(false)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/livros/adicionar", label: "Adicionar Livro" },
    { to: "/minha-estante", label: "Estante" },
  ];

  // --- CORREÇÃO (TS2339): Usa 'user.nome' (com 'o') e 'user.avatarUrl' ---
  const userMock = {
    name: user?.nome || "Usuário",
    avatarUrl: user?.avatarUrl || "https://via.placeholder.com/40",
  };
  // --- FIM DA CORREÇÃO ---

  const handleBellClick = () => {
    setIsNotificationPopupOpen((prev) => !prev);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        {" "}
        <Link to="/">TrocaHQ</Link>{" "}
      </div>
      <div className="navbar-links-main">
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} className="nav-link-item">
            {" "}
            {link.label}{" "}
          </Link>
        ))}
      </div>

      <div className="navbar-user-actions">
        <div className="action-icons">
          <div className="notification-bell-wrapper" ref={notificationPopupRef}>
            <FaBell
              className="action-icon"
              size={20}
              onClick={handleBellClick}
              style={{ cursor: "pointer" }}
            />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}

            {/* --- CORREÇÃO (TS2322): Passa 'markAsRead' para 'onMarkAsRead' --- */}
            {isNotificationPopupOpen && (
              <NotificationPopup
                notifications={notifications}
                onClose={() => setIsNotificationPopupOpen(false)}
                onMarkAsRead={markAsRead} // Prop corrigida
              />
            )}
            {/* --- FIM DA CORREÇÃO --- */}
          </div>
          <FaCommentDots
            className="action-icon"
            size={20}
            onClick={onChatIconClick}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="user-menu" ref={dropdownRef}>
          <div
            className="user-profile"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <img
              src={userMock.avatarUrl}
              alt={userMock.name}
              className="user-avatar-small"
            />
            <span className="user-name-label">{userMock.name}</span>
            <FaChevronDown
              className={`arrow-icon ${isDropdownOpen ? "open" : ""}`}
            />
          </div>
          {isDropdownOpen && (
            <ul className="dropdown-menu">
              <li>
                {" "}
                <Link to="/perfil">Meu Perfil</Link>{" "}
              </li>
              <li>
                {" "}
                <Link to="/configuracoes">Configurações</Link>{" "}
              </li>
              <li className="separator"></li>
              <li>
                {" "}
                <button onClick={handleLogout} className="logout-button">
                  {" "}
                  Sair da conta{" "}
                </button>{" "}
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

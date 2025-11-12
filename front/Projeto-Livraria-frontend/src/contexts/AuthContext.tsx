// src/contexts/AuthContext.tsx

import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { login as apiLogin } from "../services/authService";
import { io, Socket } from "socket.io-client";

export interface Notification {
  id: string;
  senderName: string;
  negociacaoId: number;
  timestamp: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  socket: Socket | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  unreadCount: number;
  notifications: Notification[];
  addNotification: (notificationData: any) => void;
  markAsRead: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const disconnectSocket = useCallback(() => {
    setSocket((currentSocket) => {
      if (currentSocket) {
        currentSocket.disconnect();
      }
      return null;
    });
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    let initialUser: User | null = null;

    if (storedToken && storedUser) {
      try {
        initialUser = JSON.parse(storedUser);
        if (initialUser && initialUser.id && initialUser.nome) {
          setUser(initialUser);
          setToken(storedToken);
        } else {
          localStorage.clear();
          initialUser = null;
        }
      } catch (e) {
        localStorage.clear();
        initialUser = null;
      }
    }

    if (initialUser?.id) {
      const newSocket = io({
        path: "/api/socket.io",
        query: { userId: initialUser.id },
        transports: ["websocket", "polling"],
      });
      setSocket(newSocket);
    }

    return () => {
      setSocket((currentSocket) => {
        currentSocket?.disconnect();
        return null;
      });
    };
  }, []);

  useEffect(() => {
    if (socket) {
      const handleNewNotification = (data: any) => {
        addNotification(data);
      };
      socket.on("new_message_notification", handleNewNotification);
      socket.on("connect", () => console.log("[Socket Conectado]:", socket.id));
      socket.on("disconnect", (reason) =>
        console.log("[Socket Desconectado]:", reason)
      );
      socket.on("connect_error", (err) => console.error("[Socket Erro]:", err));

      return () => {
        socket.off("new_message_notification", handleNewNotification);
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
      };
    }
  }, [socket]);

  const login = async (email: string, senha: string) => {
    try {
      const response = await apiLogin(email, senha);

      disconnectSocket();
      setUser(response.usuario);
      setToken(response.token);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("authUser", JSON.stringify(response.usuario));

      if (response.usuario?.id) {
        const newSocket = io({
          path: "/api/socket.io",
          query: { userId: response.usuario.id },
          transports: ["websocket", "polling"],
        });
        setSocket(newSocket);
      }
    } catch (error) {
      console.error("Falha ao logar (contexto):", error);
      throw error;
    }
  };

  const logout = () => {
    disconnectSocket();
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setNotifications([]);
    setUnreadCount(0);
  };

  const addNotification = useCallback((notificationData: any) => {
    const newNotification: Notification = {
      id: notificationData.messageId || `notif-${Date.now()}`,
      senderName: notificationData.remetente_nome || "Alguém",
      negociacaoId: notificationData.negociacaoId,
      timestamp: notificationData.timestamp || new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
    setUnreadCount((prev) => prev + 1);
  }, []);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        socket,
        login,
        logout,
        unreadCount,
        notifications,
        addNotification,
        markAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

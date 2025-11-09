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
// [CORRIGIDO] Importa 'io' e o tipo 'Socket'
import { io, Socket } from "socket.io-client";
import {
  getMyWishlistApi,
  toggleFavoriteApi,
  WishlistItem, // Importa a interface unificada
} from "../services/wishlistService";

// --- EXPORTANDO AS INTERFACES ---
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

// --- [CORREÇÃO 1] ATUALIZAR A INTERFACE DO CONTEXTO ---
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
  wishlist: WishlistItem[];
  toggleWishlistItem: (inventarioId: number) => Promise<boolean>;
  fetchWishlist: () => Promise<void>; // <-- ADICIONADO AQUI
}
// --- FIM DA CORREÇÃO ---

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
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Função para Desconectar
  const disconnectSocket = useCallback(() => {
    setSocket((currentSocket) => {
      if (currentSocket) {
        currentSocket.disconnect();
      }
      return null;
    });
  }, []);

  // Função para buscar a Wishlist (agora exportada)
  const fetchWishlist = async () => {
    try {
      const wishlistItems = await getMyWishlistApi(); // já retorna WishlistItem[]
      setWishlist(wishlistItems);
      console.log("[AuthContext] Lista de Desejos carregada:", wishlistItems);
    } catch (error) {
      console.error("[AuthContext] Erro ao buscar lista de desejos:", error);
    }
  };

  // Funções de notificação
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

  // Efeito 1: Carregar localStorage
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

    if (initialUser && initialUser.id) {
      const newSocket = io({
        path: "/api/socket.io",
        query: { userId: initialUser.id },
        transports: ["websocket", "polling"],
      });
      setSocket(newSocket);
      fetchWishlist();
    }

    return () => {
      setSocket((currentSocket) => {
        if (currentSocket) {
          currentSocket.disconnect();
        }
        return null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efeito 2: Listeners do Socket
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
  }, [socket, addNotification]);

  // Função Login (usando apiLogin)
  const login = async (email: string, senha: string) => {
    try {
      const response = await apiLogin(email, senha);

      disconnectSocket();
      setUser(response.usuario);
      setToken(response.token);
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("authUser", JSON.stringify(response.usuario));

      if (response.usuario && response.usuario.id) {
        const newSocket = io({
          path: "/api/socket.io",
          query: { userId: response.usuario.id },
          transports: ["websocket", "polling"],
        });
        setSocket(newSocket);
        fetchWishlist();
      }
    } catch (error) {
      console.error("Falha ao logar (contexto):", error);
      throw error;
    }
  };

  // Função Logout
  const logout = () => {
    disconnectSocket();
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setNotifications([]);
    setUnreadCount(0);
    setWishlist([]);
  };

  // Função para favoritar itens do INVENTÁRIO
  const toggleWishlistItem = async (inventarioId: number): Promise<boolean> => {
    try {
      const payloadId = String(inventarioId);
      const result = await toggleFavoriteApi(payloadId);

      // Ajuste baseado na sua API de toggle do Inventário
      const isFavorited = !!result.isFavorited;

      await fetchWishlist(); // Re-busca a lista unificada

      return isFavorited;
    } catch (err) {
      console.error("[AuthContext] Erro ao alternar wishlist:", err);
      await fetchWishlist();
      return false;
    }
  };

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
        wishlist,
        toggleWishlistItem,

        // [CORREÇÃO 2] Adicionando a função ao Provider
        fetchWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

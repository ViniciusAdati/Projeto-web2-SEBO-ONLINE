// src/App.tsx
// (SUBSTITUA O SEU ARQUIVO POR ESTE)

import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout"; // Importa o novo Layout
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AddBookPage } from "./pages/AddBookPage";
import { ConfirmBookDetailsPage } from "./pages/ConfirmBookDetailsPage";
import { MyShelfPage } from "./pages/MyShelfPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { ChatPage } from "./pages/ChatPage";

function App() {
  return (
    <Routes>
      {/* Rotas que NÃO TÊM a Navbar (Login/Registro) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- ALTERAÇÃO AQUI --- */}
      {/* Rotas que TÊM a Navbar (agora filhas do MainLayout) */}
      <Route path="/" element={<MainLayout />}>
        {/* A rota "pai" (/) renderiza a HomePage dentro do Outlet */}
        <Route index element={<HomePage />} />

        {/* Todas as outras páginas também são renderizadas dentro do Outlet */}
        <Route path="/livros/adicionar" element={<AddBookPage />} />
        <Route
          path="/livros/confirmar-detalhes"
          element={<ConfirmBookDetailsPage />}
        />
        <Route path="/minha-estante" element={<MyShelfPage />} />
        <Route path="/perfil" element={<UserProfilePage />} />
        <Route path="/configuracoes" element={<div>Configurações</div>} />
        <Route path="/chat/:negociacaoId" element={<ChatPage />} />

        {/* Adicione outras rotas protegidas aqui */}
      </Route>
      {/* --- FIM DA ALTERAÇÃO --- */}
    </Routes>
  );
}

export default App;

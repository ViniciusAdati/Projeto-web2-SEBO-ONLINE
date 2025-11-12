import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/MainLayout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import AddBookPage from "./pages/AddBookPage";
import { ConfirmBookDetailsPage } from "./pages/ConfirmBookDetailsPage";
import { MyShelfPage } from "./pages/MyShelfPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { ChatPage } from "./pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/livros/adicionar" element={<AddBookPage />} />
        <Route
          path="/livros/confirmar-detalhes"
          element={<ConfirmBookDetailsPage />}
        />
        <Route path="/minha-estante" element={<MyShelfPage />} />
        <Route path="/perfil/:id" element={<UserProfilePage />} />
        <Route path="/configuracoes" element={<div>Configurações</div>} />
        <Route path="/chat/:negociacaoId" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default App;

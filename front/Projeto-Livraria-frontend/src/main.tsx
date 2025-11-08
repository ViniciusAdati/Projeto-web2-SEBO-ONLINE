import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// --- CORREÇÃO AQUI ---
import App from "./App"; // Remove .tsx
import "./index.css";
// --- FIM DA CORREÇÃO ---
import "swiper/css";
import "swiper/css/pagination";

// --- CORREÇÃO AQUI ---
import { AuthProvider } from "./contexts/AuthContext"; // Remove .tsx
// --- FIM DA CORREÇÃO ---

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

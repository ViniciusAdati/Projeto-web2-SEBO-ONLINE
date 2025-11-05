// src/components/CommunityCarousel.tsx

// --- CORREÇÃO 1: 'React' foi removido ---
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "./CommunityCarousel.css"; // Este é o CSS que tem o estilo "bonitinho"

// --- CORREÇÃO 2: Importa o 'api' (axios) ---
import api from "../services/api";
// Importa o TIPO (interface) que o 'api.get' vai retornar
import type { IBookInventory } from "../services/inventoryService";
// A importação 'getRecentBooks' foi REMOVIDA

export function CommunityCarousel() {
  const [books, setBooks] = useState<IBookInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // --- CORREÇÃO 3: Chama a API via axios ---
        // Usamos a rota /api/inventory/recent que já existe no seu backend
        const response = await api.get<IBookInventory[]>("/inventory/recent");
        setBooks(response.data);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar livros.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="carousel-wrapper">
        <h2 className="carousel-title">HQs</h2>
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Carregando livros da comunidade...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carousel-wrapper">
        <h2 className="carousel-title">HQs</h2>
        <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          Erro ao carregar: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="carousel-wrapper">
      <h2 className="carousel-title">HQs</h2>

      <Swiper
        modules={[Pagination]}
        slidesPerView={5}
        spaceBetween={20}
        grabCursor={true}
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 10 },
          480: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 4, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 20 },
        }}
      >
        {books.map((book) => (
          <SwiperSlide key={book.inventario_id}>
            <div className="book-card">
              <div className="book-card-image">
                <img src={book.url_capa} alt={book.titulo} />
                <span className="book-card-tag promo">
                  {book.estado_conservacao}
                </span>
              </div>
              <h3 className="book-card-title">{book.titulo}</h3>
              <div className="book-card-price">
                <span className="new-price">
                  {/* --- CORREÇÃO 4: Garante que é um número --- */}
                  R$ {Number(book.valor_troca).toFixed(2).replace(".", ",")}
                </span>
              </div>
              <span className="installments">
                Postado por: {book.nome_usuario}
              </span>
            </div>
          </SwiperSlide>
        ))}

        {books.length === 0 && !loading && (
          <p style={{ padding: "2rem", textAlign: "center" }}>
            Nenhum livro adicionado pela comunidade ainda. Seja o primeiro!
          </p>
        )}
      </Swiper>
    </div>
  );
}

export default CommunityCarousel;

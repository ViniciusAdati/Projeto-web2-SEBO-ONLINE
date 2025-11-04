import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "../styles/CommunityCarousel.css";

import { getRecentBooks } from "../services/inventoryService";

import type { IBookInventory } from "../services/inventoryService";

export function CommunityCarousel() {
  const [books, setBooks] = useState<IBookInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecentBooks();
        setBooks(data);
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
        <h2 className="carousel-title">Livro</h2>
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Carregando livros da comunidade...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carousel-wrapper">
        <h2 className="carousel-title">Livro</h2>
        <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          Erro ao carregar: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="carousel-wrapper">
      <h2 className="carousel-title">Livro</h2>

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
                  R$ {book.valor_troca.toFixed(2).replace(".", ",")}
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

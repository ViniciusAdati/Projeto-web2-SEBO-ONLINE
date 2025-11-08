import { Heart } from "lucide-react";

interface BookCardProps {
  book: any;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onAddBook: () => void;
}

function BookCard({
  book,
  isFavorited,
  onToggleFavorite,
  onAddBook,
}: BookCardProps) {
  return (
    <div className="relative bg-white shadow-md rounded-xl p-3 flex flex-col hover:shadow-lg transition">
      <img
        src={book.thumbnail}
        alt={book.title}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h3 className="font-semibold text-sm mb-1">{book.title}</h3>
      <p className="text-xs text-gray-600 mb-2">{book.authors?.join(", ")}</p>
      <button
        onClick={onAddBook}
        className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600"
      >
        Adicionar
      </button>
      <button onClick={onToggleFavorite} className="absolute top-2 right-2">
        <Heart
          className={`w-5 h-5 ${
            isFavorited ? "text-red-500 fill-red-500" : "text-gray-400"
          }`}
        />
      </button>
    </div>
  );
}

export default BookCard;

import { useNavigate } from "react-router-dom";
import { Listing } from "../types";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { hapticFeedback } from "../lib/telegram";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Bugun";
  if (days === 1) return "1 kun oldin";
  return `${days} kun oldin`;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const isFav = user?.favorites?.includes(listing._id);

  async function toggleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    hapticFeedback("light");
    try {
      await api.post(`/listings/${listing._id}/favorite`);
      refreshUser();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      onClick={() => navigate(`/listing/${listing._id}`)}
      className="bg-card border border-border rounded-card overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-[1/0.92] overflow-hidden">
        <span
          className={`absolute top-[9px] left-[9px] text-[9.5px] font-bold uppercase px-2.5 py-1 rounded-md text-white ${
            listing.type === "ish" ? "bg-amber-600/85" : "bg-black/60"
          }`}
        >
          {listing.category?.nameUz}
        </span>
        <button
          onClick={toggleFavorite}
          className="absolute top-[9px] right-[9px] w-7 h-7 rounded-full bg-black/55 flex items-center justify-center"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={isFav ? "#17c9a3" : "none"}
            stroke={isFav ? "#17c9a3" : "#fff"}
            strokeWidth="2"
          >
            <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
          </svg>
        </button>
        <img
          src={listing.images?.[0] || "https://placehold.co/400x400/1a2436/8b96a8?text=Rasm+yo%27q"}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-3 pt-2.5 pb-3">
        <div className="text-accent font-bold text-[15px]">
          {listing.price.toLocaleString("uz-UZ")} so'm
          {listing.negotiable && <span className="text-amber-400 text-[11px] font-semibold ml-1">• kelishiladi</span>}
        </div>
        <div className="text-[13px] font-semibold mt-1 leading-tight text-[#eef1f6] line-clamp-2">
          {listing.title}
        </div>
        <div className="flex items-center justify-between mt-2.5 text-[11px] text-dimmer">
          <span className="flex items-center gap-0.5">📍 {listing.city}</span>
          <span>{timeAgo(listing.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

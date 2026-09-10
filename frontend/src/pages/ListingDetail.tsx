import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Listing } from "../types";
import StarRating from "../components/StarRating";
import { hapticFeedback } from "../lib/telegram";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    api.get(`/listings/${id}`).then(({ data }) => setListing(data.listing));
  }, [id]);

  async function startChat() {
    if (!listing) return;
    setStarting(true);
    hapticFeedback("medium");
    try {
      const { data } = await api.post("/chats", {
        sellerId: listing.seller._id,
        listingId: listing._id,
      });
      navigate(`/chat/${data.chat._id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setStarting(false);
    }
  }

  if (!listing) return <div className="text-center text-dim py-16">Yuklanmoqda...</div>;

  return (
    <div className="pb-28">
      <div className="relative aspect-square bg-card">
        <img
          src={listing.images?.[activeImg] || "https://placehold.co/600x600/1a2436/8b96a8?text=Rasm+yo%27q"}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/55 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        {listing.images?.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {listing.images.map((_, i) => (
              <span
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-1.5 h-1.5 rounded-full cursor-pointer ${
                  i === activeImg ? "bg-accent" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pt-5">
        <div className="text-accent font-bold text-2xl">
          {listing.price.toLocaleString("uz-UZ")} so'm
          {listing.negotiable && <span className="text-amber-400 text-sm font-semibold ml-2">kelishiladi</span>}
        </div>
        <h1 className="text-lg font-bold mt-2">{listing.title}</h1>
        <div className="flex items-center gap-3 text-dimmer text-xs mt-2">
          <span>📍 {listing.city}</span>
          <span>👁️ {listing.views} ko'rildi</span>
        </div>

        <div className="h-px bg-border my-5" />

        <h2 className="font-semibold mb-2">Tavsif</h2>
        <p className="text-dim text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>

        <div className="h-px bg-border my-5" />

        <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3.5">
          <div className="w-11 h-11 rounded-full bg-elevated flex items-center justify-center overflow-hidden flex-shrink-0">
            {listing.seller.avatar ? (
              <img src={listing.seller.avatar} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">👤</span>
            )}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">
              {listing.seller.firstName} {listing.seller.lastName}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <StarRating rating={listing.seller.rating} size={12} />
              <span className="text-dimmer text-[11px]">({listing.seller.reviewsCount})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-elevated border-t border-border p-4">
        <button
          onClick={startChat}
          disabled={starting}
          className="w-full bg-accent text-[#05170f] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
        >
          💬 Sotuvchi bilan bog'lanish
        </button>
      </div>
    </div>
  );
}

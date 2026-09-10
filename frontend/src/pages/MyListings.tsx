import { useEffect, useState } from "react";
import api from "../lib/api";
import { Listing } from "../types";
import ListingCard from "../components/ListingCard";
import BottomNav from "../components/BottomNav";

export default function MyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/me/listings").then(({ data }) => setListings(data.listings)).finally(() => setLoading(false));
  }, []);

  async function deleteListing(id: string) {
    await api.delete(`/listings/${id}`);
    setListings((prev) => prev.filter((l) => l._id !== id));
  }

  return (
    <div className="pb-24">
      <div className="px-5 pt-5 pb-4 text-lg font-bold">Mening e'lonlarim</div>

      {loading ? (
        <div className="text-center text-dim py-16">Yuklanmoqda...</div>
      ) : listings.length === 0 ? (
        <div className="text-center text-dim py-16 px-5">Siz hali e'lon joylashtirmagansiz</div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 px-5">
          {listings.map((l) => (
            <div key={l._id} className="relative">
              <ListingCard listing={l} />
              <button
                onClick={() => deleteListing(l._id)}
                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-xs z-10"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

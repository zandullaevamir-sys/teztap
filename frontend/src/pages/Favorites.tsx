import { useEffect, useState } from "react";
import api from "../lib/api";
import { Listing } from "../types";
import ListingCard from "../components/ListingCard";
import BottomNav from "../components/BottomNav";

export default function Favorites() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/me/favorites").then(({ data }) => setListings(data.favorites)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pb-24">
      <div className="px-5 pt-5 pb-4 text-lg font-bold">Saralangan e'lonlar</div>

      {loading ? (
        <div className="text-center text-dim py-16">Yuklanmoqda...</div>
      ) : listings.length === 0 ? (
        <div className="text-center text-dim py-16 px-5">Sevimli e'lonlaringiz yo'q</div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 px-5">
          {listings.map((l) => (
            <ListingCard key={l._id} listing={l} />
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

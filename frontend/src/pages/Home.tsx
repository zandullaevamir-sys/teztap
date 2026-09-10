import { useEffect, useState } from "react";
import api from "../lib/api";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryChip from "../components/CategoryChip";
import ListingCard from "../components/ListingCard";
import BottomNav from "../components/BottomNav";
import { Category, Listing } from "../types";

export default function Home() {
  const [tab, setTab] = useState<"mahsulot" | "ish">("mahsulot");
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { type: tab };
    if (activeCategory !== "all") params.category = activeCategory;
    if (search) params.search = search;

    api
      .get("/listings", { params })
      .then(({ data }) => setListings(data.listings))
      .finally(() => setLoading(false));
  }, [tab, activeCategory, search]);

  return (
    <div className="pb-24">
      <Header />

      <div className="flex gap-2.5 px-5 pb-4">
        <button
          onClick={() => setTab("mahsulot")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[14px] font-semibold border ${
            tab === "mahsulot" ? "bg-accent text-[#05170f] border-accent" : "bg-elevated text-dimmer border-border"
          }`}
        >
          🛍️ Mahsulotlar
        </button>
        <button
          onClick={() => setTab("ish")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] text-[14px] font-semibold border ${
            tab === "ish" ? "bg-accent text-[#05170f] border-accent" : "bg-elevated text-dimmer border-border"
          }`}
        >
          💼 Ish e'lonlari
        </button>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <div className="flex gap-2.5 px-5 pb-5 overflow-x-auto no-scrollbar">
        <CategoryChip label="Barchasi" icon="▦" active={activeCategory === "all"} onClick={() => setActiveCategory("all")} />
        {categories
          .filter((c) => c.type === tab)
          .map((c) => (
            <CategoryChip
              key={c._id}
              label={c.nameUz}
              icon={c.icon}
              active={activeCategory === c._id}
              onClick={() => setActiveCategory(c._id)}
            />
          ))}
      </div>

      <div className="px-5 pb-3.5 text-[16px] font-bold">So'nggi e'lonlar</div>

      {loading ? (
        <div className="text-center text-dim py-10">Yuklanmoqda...</div>
      ) : listings.length === 0 ? (
        <div className="text-center text-dim py-10 px-5">Hozircha e'lonlar yo'q. Birinchi bo'lib e'lon joylashtiring!</div>
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

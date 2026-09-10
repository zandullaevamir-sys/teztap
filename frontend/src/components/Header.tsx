import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const CITIES = ["Barcha shaharlar", "Toshkent", "Samarqand", "Buxoro", "Andijon", "Namangan", "Farg'ona"];

export default function Header() {
  const { user } = useAuth();
  const [cityOpen, setCityOpen] = useState(false);
  const [city, setCity] = useState(user?.city || "Barcha shaharlar");
  const [lang, setLang] = useState<"UZ" | "RU">("UZ");

  return (
    <div className="flex items-center justify-between px-5 pt-4 pb-3 relative">
      <div className="flex items-center gap-2 font-bold text-[19px]">
        <span className="w-[30px] h-[30px] rounded-[9px] bg-accent flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#05170f">
            <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
          </svg>
        </span>
        TezTop
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCityOpen((o) => !o)}
          className="flex items-center gap-1 bg-elevated border border-border text-dim text-[12.5px] px-2.5 py-1.5 rounded-lg"
        >
          {city.length > 12 ? city.slice(0, 10) + "..." : city}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div className="flex bg-elevated border border-border rounded-lg overflow-hidden text-[12px] font-semibold">
          <span
            onClick={() => setLang("UZ")}
            className={`px-2.5 py-1.5 cursor-pointer ${lang === "UZ" ? "bg-card text-white" : "text-dimmer"}`}
          >
            UZ
          </span>
          <span
            onClick={() => setLang("RU")}
            className={`px-2.5 py-1.5 cursor-pointer ${lang === "RU" ? "bg-card text-white" : "text-dimmer"}`}
          >
            RU
          </span>
        </div>
      </div>

      {cityOpen && (
        <div className="absolute top-14 right-5 bg-elevated border border-border rounded-lg z-20 shadow-lg overflow-hidden">
          {CITIES.map((c) => (
            <div
              key={c}
              onClick={() => {
                setCity(c);
                setCityOpen(false);
              }}
              className="px-4 py-2.5 text-[13px] text-dim hover:bg-card cursor-pointer whitespace-nowrap"
            >
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

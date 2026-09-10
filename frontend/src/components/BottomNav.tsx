import { NavLink, useNavigate } from "react-router-dom";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-1 text-[10.5px] font-semibold ${
    isActive ? "text-accent" : "text-dimmer"
  }`;

export default function BottomNav() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto flex items-center justify-around bg-elevated border-t border-border px-3 pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] z-30">
      <NavLink to="/" end className={navItemClass}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h14V10" />
        </svg>
        Bosh sahifa
      </NavLink>

      <NavLink to="/favorites" className={navItemClass}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
        </svg>
        Saralangan
      </NavLink>

      <button
        onClick={() => navigate("/create")}
        className="w-[46px] h-[46px] rounded-full bg-accent flex items-center justify-center -mt-[26px] border-4 border-elevated shadow-[0_6px_16px_rgba(23,201,163,0.4)]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05170f" strokeWidth="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      <NavLink to="/my-listings" className={navItemClass}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        E'lonlarim
      </NavLink>

      <NavLink to="/profile" className={navItemClass}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </svg>
        Profil
      </NavLink>
    </div>
  );
}

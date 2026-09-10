import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const menuItems = [
    { label: "Mening e'lonlarim", icon: "📦", path: "/my-listings" },
    { label: "Saralangan", icon: "❤️", path: "/favorites" },
    { label: "Suhbatlar", icon: "💬", path: "/chats" },
    { label: "Sharhlar", icon: "⭐", path: `/ratings/${user._id}` },
  ];

  return (
    <div className="pb-24">
      <div className="flex flex-col items-center pt-8 pb-6 px-5">
        <div className="w-20 h-20 rounded-full bg-elevated border border-border flex items-center justify-center overflow-hidden mb-3">
          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="text-3xl">👤</span>}
        </div>
        <div className="font-bold text-lg">{user.firstName} {user.lastName}</div>
        <div className="text-dimmer text-xs mt-1">{user.phone || "Telefon kiritilmagan"}</div>
        <div className="flex items-center gap-1.5 mt-2">
          <StarRating rating={user.rating} />
          <span className="text-dimmer text-xs">({user.reviewsCount} sharh)</span>
        </div>
        <div className="text-dim text-xs mt-1">📍 {user.city}</div>
      </div>

      <div className="px-5 flex flex-col gap-2.5">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3.5 cursor-pointer"
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              <span>{item.icon}</span> {item.label}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5f6b7d" strokeWidth="2">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

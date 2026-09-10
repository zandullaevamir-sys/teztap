import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { requestContact, getTelegramWebApp } from "../lib/telegram";

export default function Login() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [manualPhone, setManualPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const isTelegram = !!getTelegramWebApp();

  async function savePhone(phone: string) {
    if (!user) return;
    setSaving(true);
    try {
      const { data } = await api.post("/auth/phone", { userId: user._id, phone });
      setUser(data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleTelegramContact() {
    requestContact((phone) => savePhone(phone));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#05170f">
          <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      </div>
      <h1 className="text-xl font-bold mb-2">TezTop'ga xush kelibsiz</h1>
      <p className="text-dim text-sm mb-8">
        Davom etish uchun telefon raqamingizni tasdiqlang. Bu sotuvchilar bilan bog'lanish uchun kerak.
      </p>

      {isTelegram ? (
        <button
          onClick={handleTelegramContact}
          disabled={saving}
          className="w-full bg-accent text-[#05170f] font-bold py-3.5 rounded-xl"
        >
          📱 Telefon raqamni yuborish
        </button>
      ) : (
        <div className="w-full flex flex-col gap-3">
          <input
            value={manualPhone}
            onChange={(e) => setManualPhone(e.target.value)}
            placeholder="+998 90 123 45 67"
            className="w-full bg-elevated border border-border rounded-xl px-4 py-3.5 text-white text-center outline-none"
          />
          <button
            onClick={() => savePhone(manualPhone)}
            disabled={saving || manualPhone.length < 9}
            className="w-full bg-accent text-[#05170f] font-bold py-3.5 rounded-xl disabled:opacity-50"
          >
            Davom etish
          </button>
        </div>
      )}
    </div>
  );
}

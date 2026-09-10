import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Category } from "../types";
import { hapticFeedback } from "../lib/telegram";

const CITIES = ["Toshkent", "Samarqand", "Buxoro", "Andijon", "Namangan", "Farg'ona"];

export default function CreateListing() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<"mahsulot" | "ish">("mahsulot");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("Toshkent");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.categories));
  }, []);

  // Rasmlarni to'g'ridan-to'g'ri Cloudinary'ga (backend orqali) yuklaydi,
  // qaytgan URL'larni saqlaydi — bazada faqat link turadi, og'ir base64 emas
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 6 - images.length);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages((prev) => [...prev, ...data.urls]);
    } catch (err) {
      console.error(err);
      setError("Rasm yuklashda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setUploading(false);
      e.target.value = ""; // bir xil faylni qayta tanlash imkoniyati uchun
    }
  }

  async function handleSubmit() {
    setError("");
    if (!title || !description || !price || !category) {
      setError("Barcha majburiy maydonlarni to'ldiring");
      return;
    }
    setSaving(true);
    hapticFeedback("medium");
    try {
      await api.post("/listings", {
        title,
        description,
        price: Number(price),
        negotiable,
        category,
        type,
        city,
        images,
      });
      navigate("/my-listings");
    } catch (err) {
      console.error(err);
      setError("E'lon joylashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pb-28 px-5 pt-5">
      <h1 className="text-lg font-bold mb-5">Yangi e'lon joylashtirish</h1>

      <div className="flex gap-2.5 mb-5">
        <button
          onClick={() => setType("mahsulot")}
          className={`flex-1 py-2.5 rounded-[10px] text-sm font-semibold border ${
            type === "mahsulot" ? "bg-accent text-[#05170f] border-accent" : "bg-elevated text-dimmer border-border"
          }`}
        >
          🛍️ Mahsulot
        </button>
        <button
          onClick={() => setType("ish")}
          className={`flex-1 py-2.5 rounded-[10px] text-sm font-semibold border ${
            type === "ish" ? "bg-accent text-[#05170f] border-accent" : "bg-elevated text-dimmer border-border"
          }`}
        >
          💼 Ish e'loni
        </button>
      </div>

      <label className="text-xs text-dim mb-1.5 block">Rasmlar (maks. 6 ta)</label>
      <div className="flex gap-2.5 mb-5 overflow-x-auto no-scrollbar">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <img src={img} className="w-full h-full object-cover" />
            <button
              onClick={() => setImages(images.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white text-xs"
            >
              ✕
            </button>
          </div>
        ))}
        {images.length < 6 && (
          <label
            className={`w-20 h-20 flex-shrink-0 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-dimmer text-2xl ${
              uploading ? "opacity-50 pointer-events-none" : "cursor-pointer"
            }`}
          >
            {uploading ? <span className="text-xs">⏳</span> : "+"}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              disabled={uploading}
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      <label className="text-xs text-dim mb-1.5 block">Sarlavha *</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Masalan: iPhone 14 Pro Max 256GB"
        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-white text-sm outline-none mb-4"
      />

      <label className="text-xs text-dim mb-1.5 block">Tavsif *</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        placeholder="Mahsulot haqida batafsil ma'lumot..."
        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-white text-sm outline-none mb-4 resize-none"
      />

      <label className="text-xs text-dim mb-1.5 block">Narx (so'm) *</label>
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
        placeholder="0"
        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-white text-sm outline-none mb-3"
      />
      <label className="flex items-center gap-2 mb-4 text-sm text-dim">
        <input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} />
        Narx kelishiladigan
      </label>

      <label className="text-xs text-dim mb-1.5 block">Kategoriya *</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-white text-sm outline-none mb-4"
      >
        <option value="">Tanlang...</option>
        {categories
          .filter((c) => c.type === type)
          .map((c) => (
            <option key={c._id} value={c._id}>
              {c.icon} {c.nameUz}
            </option>
          ))}
      </select>

      <label className="text-xs text-dim mb-1.5 block">Shahar *</label>
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-white text-sm outline-none mb-4"
      >
        {CITIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={saving || uploading}
        className="w-full bg-accent text-[#05170f] font-bold py-3.5 rounded-xl mt-2 disabled:opacity-50"
      >
        {saving ? "Joylanmoqda..." : uploading ? "Rasmlar yuklanmoqda..." : "E'lonni joylashtirish"}
      </button>
    </div>
  );
}

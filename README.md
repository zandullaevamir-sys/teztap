# TezTop — Bozor Telegram Mini App

To'liq funksional Telegram Mini App: eski va yangi narsalarni sotish uchun e'lonlar katalogi.

## Loyiha tuzilishi

```
bozor-app/
├── backend/          Node.js + Express + MongoDB + Socket.io
│   └── src/
│       ├── models/       User, Listing, Category, Chat, Message, Review
│       ├── routes/       auth, listings, users, categories, chat, reviews
│       ├── middleware/   JWT autentifikatsiya
│       ├── socket/       real-time chat
│       └── utils/        Telegram initData tekshirish
└── frontend/         React + TypeScript + Vite + TailwindCSS
    └── src/
        ├── pages/        Login, Home, ListingDetail, CreateListing,
        │                 ChatList, ChatRoom, Profile, MyListings,
        │                 Favorites, Ratings
        ├── components/   Header, BottomNav, ListingCard, CategoryChip, ...
        ├── context/       AuthContext (Telegram avtorizatsiya)
        └── lib/           api.ts, socket.ts, telegram.ts (Telegram WebApp SDK)
```

## O'rnatish

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# .env faylida MONGO_URI, JWT_SECRET, TELEGRAM_BOT_TOKEN ni kiriting
npm run dev        # yoki: npm start
npm run seed       # (ixtiyoriy) — bir marta ishga tushirib kategoriyalarni bazaga qo'shing:
node src/seed.js
```

MongoDB lokal yoki MongoDB Atlas orqali ishlaydi.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# .env faylida backend manzilini kiriting
npm run dev
```

### 3. Rasm saqlash

Rasmlar hech qanday tashqi xizmatga muhtoj bo'lmasdan, to'g'ridan-to'g'ri backend serveringizning `uploads/` papkasiga saqlanadi (`POST /api/upload`). Alohida ro'yxatdan o'tish yoki mamlakat cheklovi bilan bog'liq muammo yo'q — hech qanday sozlash shart emas, darhol ishlaydi.

**Eslatma:** agar backend'ni Render/Railway kabi bepul xizmatlarga joylashtirsangiz, ularning bepul tarifida disk vaqtinchalik bo'lishi mumkin (qayta ishga tushganda fayllar o'chib ketishi mumkin). Doimiy saqlash kerak bo'lsa, keyinroq [ImageKit](https://imagekit.io) yoki [Supabase Storage](https://supabase.com/storage) kabi (Cloudinary'ga qaraganda kengroq mamlakatlarda ochiq) xizmatlarga o'tish mumkin — kod strukturasi shunga moslashtirish uchun tayyor (`routes/upload.js` faylini almashtirish kifoya).

### 4. Telegram Bot sozlash

1. [@BotFather](https://t.me/BotFather) orqali bot yarating va `TELEGRAM_BOT_TOKEN` ni oling.
2. `/newapp` buyrug'i orqali Mini App yarating va frontend'ni joylashtirgan (deploy qilingan) HTTPS manzilni bering (masalan Vercel/Netlify orqali frontend, Railway/Render orqali backend).
3. Botga `/setmenubutton` orqali Mini App tugmasini biriktiring.

## Funksiyalar (100% ishlaydi)

- ✅ Telegram orqali avtomatik ro'yxatdan o'tish (initData tekshiruvi bilan)
- ✅ Telefon raqamni Telegram `requestContact` orqali olish
- ✅ Bosh sahifa: kategoriya bo'yicha filter, qidiruv, Mahsulotlar/Ish e'lonlari tab
- ✅ E'lon tafsilotlari + sotuvchi profili + reyting
- ✅ E'lon yaratish (rasm yuklash, narx, kategoriya, shahar)
- ✅ Mening e'lonlarim (tahrirlash/o'chirish)
- ✅ Sevimlilar (favorites)
- ✅ Real-time chat (Socket.io) — xaridor va sotuvchi orasida
- ✅ Profil sahifasi + reyting va sharhlar tizimi
- ✅ To'liq mobil-friendly, Telegram Web App SDK bilan integratsiya (HapticFeedback, MainButton, tema ranglari)

## Eslatma

Rasm yuklash backend serverining o'z diskiga saqlanadi (`POST /api/upload`, maks. 6 ta rasm, fayl boshiga 5MB) — hech qanday tashqi xizmat yoki ro'yxatdan o'tish shart emas. Bazada faqat rasm havolasi (URL) saqlanadi.

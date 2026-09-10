# Hostingga joylashtirish (Deploy) qo'llanmasi

Loyiha 3 qismdan iborat: **Frontend** (statik sayt), **Backend** (doimiy ishlaydigan server), **Baza** (MongoDB). Har biri alohida joyga joylashtiriladi.

⚠️ **Muhim eslatma:** Ba'zi global xizmatlar (masalan, avval ko'rgan Cloudinary) O'zbekistondan ro'yxatdan o'tishni cheklashi mumkin. Quyida har bir qism uchun 2-3 ta muqobil variant berilgan — biri ishlamasa, boshqasini sinab ko'ring.

---

## 1. Baza — MongoDB Atlas

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) da bepul akkaunt oching (M0 tarif — bepul, abadiy).
2. Yangi cluster yarating (eng yaqin region: Frankfurt yoki Singapore tanlang — tezroq ishlaydi).
3. **Database Access** — foydalanuvchi yarating (login+parol).
4. **Network Access** — `0.0.0.0/0` qo'shing (barcha IP'lardan ulanishga ruxsat, backend hosting IP'i o'zgaruvchan bo'lgani uchun).
5. **Connect** tugmasi → "Drivers" → connection string'ni nusxalang. Bu sizning `MONGO_URI` bo'ladi:
   ```
   mongodb+srv://user:parol@cluster0.xxxxx.mongodb.net/bozor
   ```

**Agar Atlas ham ishlamasa:** o'zingizning VPS serveringizga MongoDB'ni o'rnatish mumkin (pastdagi VPS bo'limiga qarang).

---

## 2. Backend (Node.js + Socket.io) — doimiy server kerak

Socket.io real-time chat uchun serverless emas, **doimiy ishlaydigan** hosting kerak.

### Variant A — Render.com (tavsiya etiladi, bepul tarifi bor)

1. [render.com](https://render.com) da akkaunt oching (GitHub orqali kirish qulay).
2. Loyihani GitHub'ga yuklang (`git push`).
3. Render'da **New → Web Service** → GitHub repo'ni tanlang.
4. Sozlamalar:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Environment** bo'limida `.env`dagi barcha o'zgaruvchilarni qo'shing (`MONGO_URI`, `JWT_SECRET`, `TELEGRAM_BOT_TOKEN`, `CLIENT_URL`).
6. Deploy tugagach, sizga `https://sizning-nom.onrender.com` manzili beriladi.

⚠️ Bepul tarifda 15 daqiqa faolsizlikdan keyin server "uxlab qoladi" va birinchi so'rov 30-50 soniya kechikadi. Doimiy faol bo'lishi uchun pullik ($7/oy) tarifga o'tish kerak.

### Variant B — Railway.app

Xuddi shunday: GitHub'ni ulaysiz, `backend` papkasini root sifatida ko'rsatasiz, environment o'zgaruvchilarni qo'shasiz. Bepul limit oyiga $5 kredit.

### Variant C — VPS (eng ishonchli, cheklov yo'q)

Agar Render/Railway O'zbekistondan to'lov kartasi so'rasa yoki bloklansa, VPS eng barqaror yechim:

- **Hetzner** (hetzner.com) — Yevropada, arzon (~€4/oy)
- **Timeweb** yoki **Beget** — rus tilida, kartangiz (Uzcard/Humo emas, xalqaro Visa/Mastercard kerak) bilan ishlaydi, CIS mintaqasida keng tarqalgan
- **Oracle Cloud Free Tier** — doimiy bepul VM beradi, lekin ro'yxatdan o'tishda xalqaro karta so'raydi

VPS'da PM2 bilan ishga tushirish:
```bash
npm install -g pm2
cd backend
npm install
pm2 start src/server.js --name bozor-backend
pm2 save
pm2 startup
```
Va Nginx orqali reverse proxy + HTTPS (Let's Encrypt/Certbot) sozlanadi — Telegram Mini App **faqat HTTPS** manzillarni qabul qiladi.

---

## 3. Frontend (React statik sayt)

### Variant A — Vercel

1. [vercel.com](https://vercel.com) → GitHub repo'ni import qiling.
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`, **Output Directory:** `dist`
4. **Environment Variables:** `VITE_API_URL` va `VITE_SOCKET_URL` ni backend manzilingizga qarab kiriting (masalan `https://sizning-nom.onrender.com/api` va `https://sizning-nom.onrender.com`).

### Variant B — Netlify

Xuddi shunday jarayon: repo ulash → root `frontend` → build `npm run build` → publish `dist`.

### Variant C — Cloudflare Pages

Ko'p mintaqada tezroq ishlaydi, xuddi shu sozlamalar bilan.

Har uchalasi ham bepul va HTTPS avtomatik beradi (Telegram Mini App uchun shart).

---

## 4. Backend'da CLIENT_URL'ni yangilash

Frontend deploy bo'lgach, backend `.env`dagi `CLIENT_URL`ni frontend manzilingizga o'zgartiring (CORS xatosi bo'lmasligi uchun), masalan:
```
CLIENT_URL=https://sizning-app.vercel.app
```

## 5. Telegram botga ulash

1. [@BotFather](https://t.me/BotFather) → botingizni tanlang → **Bot Settings → Menu Button** → frontend HTTPS manzilingizni kiriting.
2. Yoki `/newapp` orqali alohida Mini App yarating.

---

## Tavsiya etilgan eng oddiy kombinatsiya

**MongoDB Atlas** (baza) + **Render** (backend) + **Vercel** (frontend) — barchasi bepul tarifda boshlanadi, karta talab qilmaydi (Render/Vercel/Atlas bepul tarifi karta so'ramaydi, faqat GitHub akkaunt kifoya).

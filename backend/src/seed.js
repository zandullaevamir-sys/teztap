import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
  { slug: "phone-gadget", nameUz: "Telefon & Gadjet", nameRu: "Телефоны и гаджеты", icon: "📱", type: "mahsulot" },
  { slug: "auto-transport", nameUz: "Avto & Transport", nameRu: "Авто и транспорт", icon: "🚗", type: "mahsulot" },
  { slug: "real-estate", nameUz: "Ko'chmas mulk", nameRu: "Недвижимость", icon: "🏠", type: "mahsulot" },
  { slug: "electronics", nameUz: "Elektronika", nameRu: "Электроника", icon: "💻", type: "mahsulot" },
  { slug: "furniture", nameUz: "Mebel", nameRu: "Мебель", icon: "🛋️", type: "mahsulot" },
  { slug: "clothing", nameUz: "Kiyim-kechak", nameRu: "Одежда", icon: "👕", type: "mahsulot" },
];

async function seed() {
  await connectDB();
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log("✅ Kategoriyalar qo'shildi");
  process.exit(0);
}

seed();

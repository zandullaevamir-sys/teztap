export interface Category {
  _id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  icon: string;
  type: "mahsulot" | "ish";
}

export interface User {
  _id: string;
  telegramId?: string;
  username?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  city: string;
  rating: number;
  reviewsCount: number;
  favorites?: string[];
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  images: string[];
  category: Category;
  type: "mahsulot" | "ish";
  city: string;
  seller: User;
  status: "active" | "sold" | "archived";
  views: number;
  createdAt: string;
}

export interface ChatItem {
  _id: string;
  participants: User[];
  listing?: { title: string; images: string[]; price: number };
  lastMessage: string;
  lastMessageAt: string;
}

export interface Message {
  _id: string;
  chat: string;
  sender: string;
  text: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  fromUser: User;
  rating: number;
  comment: string;
  createdAt: string;
}

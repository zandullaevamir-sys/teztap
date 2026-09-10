import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Home from "./pages/Home";
import ListingDetail from "./pages/ListingDetail";
import CreateListing from "./pages/CreateListing";
import ChatList from "./pages/ChatList";
import ChatRoom from "./pages/ChatRoom";
import Profile from "./pages/Profile";
import MyListings from "./pages/MyListings";
import Favorites from "./pages/Favorites";
import Ratings from "./pages/Ratings";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-dim">Yuklanmoqda...</div>;
  }

  if (!user || !user.phone) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-bg relative">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/listing/:id" element={<RequireAuth><ListingDetail /></RequireAuth>} />
        <Route path="/create" element={<RequireAuth><CreateListing /></RequireAuth>} />
        <Route path="/chats" element={<RequireAuth><ChatList /></RequireAuth>} />
        <Route path="/chat/:id" element={<RequireAuth><ChatRoom /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/my-listings" element={<RequireAuth><MyListings /></RequireAuth>} />
        <Route path="/favorites" element={<RequireAuth><Favorites /></RequireAuth>} />
        <Route path="/ratings/:userId" element={<RequireAuth><Ratings /></RequireAuth>} />
      </Routes>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { ChatItem } from "../types";
import BottomNav from "../components/BottomNav";

export default function ChatList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatItem[]>([]);

  useEffect(() => {
    api.get("/chats").then(({ data }) => setChats(data.chats));
  }, []);

  return (
    <div className="pb-24">
      <div className="px-5 pt-5 pb-4 text-lg font-bold">Suhbatlar</div>

      {chats.length === 0 ? (
        <div className="text-center text-dim py-16 px-5">Hozircha suhbatlaringiz yo'q</div>
      ) : (
        <div className="px-5 flex flex-col gap-2.5">
          {chats.map((chat) => {
            const other = chat.participants.find((p) => p._id !== user?._id);
            return (
              <div
                key={chat._id}
                onClick={() => navigate(`/chat/${chat._id}`)}
                className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-elevated flex items-center justify-center overflow-hidden flex-shrink-0">
                  {other?.avatar ? <img src={other.avatar} className="w-full h-full object-cover" /> : "👤"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{other?.firstName} {other?.lastName}</div>
                  <div className="text-dimmer text-xs truncate mt-0.5">{chat.lastMessage || "Suhbatni boshlang"}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

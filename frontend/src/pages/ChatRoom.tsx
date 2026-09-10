import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../lib/socket";
import { Message } from "../types";

export default function ChatRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/chats/${id}/messages`).then(({ data }) => setMessages(data.messages));

    const socket = getSocket();
    socket.emit("join_chat", id);
    socket.on("new_message", (msg: Message) => {
      if (msg.chat === id) setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("new_message");
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!text.trim() || !user || !id) return;
    const socket = getSocket();
    socket.emit("send_message", { chatId: id, senderId: user._id, text: text.trim() });
    setText("");
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="font-semibold">Suhbat</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2.5">
        {messages.map((m) => {
          const mine = m.sender === user?._id;
          return (
            <div
              key={m._id}
              className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm ${
                mine ? "self-end bg-accent text-[#05170f] rounded-br-sm" : "self-start bg-card text-white rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2.5 px-4 py-3 border-t border-border">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Xabar yozing..."
          className="flex-1 bg-elevated border border-border rounded-full px-4 py-2.5 text-sm text-white outline-none"
        />
        <button onClick={sendMessage} className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#05170f"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  getConversations,
  getMessages,
  createPrivateConversation,
  updateConversation,
} from "@/lib/api/chatApi";
import { createSignalRConnection } from "@/lib/signalr";

export default function ChatPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);


  const connectionRef = useRef<any>(null);
  const currentUserId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user")!).userId
      : null;

      useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "auto" });
}, [messages]);
 


  // load sidebar
  useEffect(() => {
    getConversations().then(setConversations);
  }, []);
  useEffect(() => {
    return () => {
      connectionRef.current?.stop();
    };
  }, []);

  const openChat = async (conversation: any) => {
    // 1️⃣ pehla activeConversation set
    setActiveConversation(conversation);

    // 2️⃣ old messages load
    const msgs = await getMessages(conversation.id);
    setMessages(msgs);

    // 3️⃣ SignalR connect (once)
    if (!connectionRef.current) {
      const connection = createSignalRConnection();
      await connection.start();

      connection.on("ReceiveMessage", (msg: any) => {
        setMessages((prev) => {
          if (!prev.length) return [msg];
          if (prev[prev.length - 1]?.id === msg.id) return prev;
          return [...prev, msg];
        });
      });

      connectionRef.current = connection;
    }

    // 4️⃣ JOIN GROUP (IMPORTANT)
    await connectionRef.current.invoke("JoinConversation", conversation.id);
  };

  return (
    <main
      className={`ml-[48px] mt-[60px] overflow-hidden transition-all duration-300 ${
        isExpanded ? "" : "px-5 pt-5"
      }`}
    >
      <div
        className={`flex   bg-[var(--card-bg)] overflow-hidden rounded-lg   shadow-[var(--card-shadow)]  border border-[var(--border-color)] transition-all duration-300 ${
          isExpanded
            ? "w-[96.29vw] h-[89vh] rounded-none   "
            : "w-[92vw] h-[calc(100vh-56px-40px)]  "
        }`}
      >
        {/* CONTACTS SIDEBAR */}
        <aside className="w-[30%] max-w-[350px] min-w-[280px] border-r border-[var(--border-color)] flex flex-col bg-[var(--card-bg)] ">
          <div className="px-5 py-4 border-b border-[var(--border-color)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Messages
            </h2>
          </div>

          <div className="px-5 py-3 border-b border-[var(--border-color)]">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-3 py-2 text-sm rounded-full border border-[var(--border-color)]   bg-[var(--bg-tertiary)]   text-[var(--text-primary)]   placeholder:text-[var(--text-secondary)]"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => openChat(c)}
                className={`flex items-center gap-3 px-5 py-3 cursor-pointer
        ${
          activeConversation?.id === c.id
            ? "bg-[var(--bg-tertiary)]"
            : "hover:bg-[var(--bg-tertiary)]"
        }
      `}
              >
                <Avatar text="PC" color="from-blue-500 to-blue-400" />

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-[var(--text-primary)]">
                    {c.conversationType === "Private"
                      ? "Private Chat"
                      : c.groupName}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] truncate">
                    Click to open chat
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CHAT AREA */}
        <section className="flex-1 flex flex-col bg-[var(--card-bg)] ">
          {/* HEADER */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--border-color)] ">
            <div className="flex items-center gap-3">
              <Avatar text="TS" color="from-blue-500 to-blue-400" />
              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  Team Snera
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  5 members, 3 online
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {isExpanded ? (
                <CollapseIcon onClick={() => setIsExpanded(false)} />
              ) : (
                <ExpandIcon onClick={() => setIsExpanded(true)} />
              )}
              <svg
                className="w-5 h-5 cursor-pointer fill-[var(--icon-color)] hover:fill-[var(--icon-hover)] transition duration-200"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-[var(--bg-primary)]">
            {messages.map((m) =>
              m.senderId === currentUserId ? (
                <Sent key={m.id} avatar="ME" color="from-blue-500 to-blue-400">
                  {m.messageText}
                </Sent>
              ) : (
                <Received
                  key={m.id}
                  avatar="US"
                  color="from-gray-500 to-gray-400"
                >
                  {m.messageText}
                </Received>
              )
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="px-5 py-3 border-t border-[var(--border-color)] flex items-center gap-3 bg-[var (--card-bg)] ">
            <svg
              className="w-5 h-5 cursor-pointer fill-[var(--icon-color)] hover:fill-[var(--icon-hover)] transition duration-200"
              viewBox="0 0 24 24"
            >
              <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z" />
            </svg>

            <input
              value={messageText}
              
              onChange={(e) => setMessageText(e.target.value)}
              
              className="flex-1
                        border border-[var(--border-color)]
                        rounded-[20px]
                        px-4 py-2.5
                        text-sm
                        h-10
                        
                        bg-[var(--bg-tertiary)]
                        text-[var(--text-primary)]
                        placeholder:text-[var(--text-secondary)]"
              placeholder="Type a message..."
            ></input>

            <button
              onClick={async () => {
                if (!messageText.trim() || !activeConversation) return;

                const user = JSON.parse(localStorage.getItem("user")!);

                 
                
                // 🔹 SEND VIA SIGNALR (REAL)
                await connectionRef.current.invoke(
                  "SendMessage",
                  activeConversation.id,
                  messageText
                );
                setMessageText("");
              }}
              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 fill-[var(--text-primary)]"
                viewBox="0 0 24 24"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ----------------- COMPONENTS ----------------- */

function Avatar({ text, color }: { text: string; color: string }) {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-primary)] text-sm font-semibold bg-gradient-to-br ${color}`}
    >
      {text}
    </div>
  );
}

function Contact({ name, message, avatar, gradient, time }: any) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-[var(--bg-tertiary)] transition duration-200 ">
      <Avatar text={avatar} color={gradient} />
      <ContactInfo name={name} message={message} />
      <Meta time={time} />
    </div>
  );
}

function ContactInfo({ name, message }: any) {
  return (
    <div className="flex-1 min-w-0">
      <div className="font-medium text-sm text-[var(--text-primary)] truncate">
        {name}
      </div>
      <div className="text-xs text-[var(--text-secondary)] truncate">
        {message}
      </div>
    </div>
  );
}

function Meta({ time, unread }: any) {
  return (
    <div className="flex flex-col items-end gap-1 text-xs text-[var(--text-primary)]">
      <span>{time}</span>
      {unread && (
        <span className="bg-[var(--accent-color)] text-[var(--text-forth)] px-2 rounded-full text-[11px] text-bold">
          3
        </span>
      )}
    </div>
  );
}

function Received({ avatar, color, children }: any) {
  return (
    <div className="flex gap-2 max-w-[70%]">
      <Avatar text={avatar} color={color} />
      <div className="text-[var(--text-primary)]">
        <div className="bg-[var(--card-bg)]  border border-[var(--border-color)] rounded-2xl rounded-bl-sm px-4 py-2 text-sm">
          {children}
        </div>
        <div className="text-xs text-[var(--text-primary)] px-2 mt-1">
          10:20 AM
        </div>
      </div>
    </div>
  );
}

function Sent({ avatar, color, children }: any) {
  return (
    <div className="flex gap-2 max-w-[70%] self-end flex-row-reverse">
      <Avatar text={avatar} color={color} />
      <div>
        <div className="bg-blue-600 text-[var(--text-primary)] rounded-2xl rounded-br-sm px-4 py-2 text-sm">
          {children}
        </div>
        <div className="text-xs text-[var(--text-primary)] text-right px-2 mt-1">
          10:25 AM
        </div>
      </div>
    </div>
  );
}

const ExpandIcon = ({ onClick }: { onClick: () => void }) => (
  <svg
    onClick={onClick}
    className="w-5 h-5 cursor-pointer fill-[var(--icon-color)] hover:fill-[var(--icon-hover)] transition duration-200"
    viewBox="0 0 24 24"
  >
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </svg>
);
const CollapseIcon = ({ onClick }: { onClick: () => void }) => (
  <svg
    onClick={onClick}
    className="w-5 h-5 cursor-pointer fill-[var(--icon-color)] hover:fill-[var(--icon-hover)] transition duration-200"
    viewBox="0 0 24 24"
  >
    <path d="M 5 16 h 3 v 3 h 2 v -5 H 5 v 2 Z m 3 -8 H 5 v 2 h 5 V 5 H 8 v 3 Z m 6 11 h 2 v -3 h 3 v -2 h -5 v 5 Z m 2 -11 V 5 h -2 v 5 h 5 V 8 h -3 Z" />
  </svg>
);

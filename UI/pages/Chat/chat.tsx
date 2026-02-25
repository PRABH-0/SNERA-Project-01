"use client";

import { useEffect, useRef, useState } from "react";
import {
  getConversations,
  getMessages,
  createPrivateConversation,
  updateConversation,
} from "@/lib/api/chatApi";
import { createSignalRConnection } from "@/lib/signalr";
import { getAvatarName } from "@/utils/getAvatarName";
import userApi from "@/lib/api/userApi";

export default function ChatPage() {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const connectionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    userApi
      .getMe()
      .then((res) => {
        console.log("My profile:", res.data);
        setCurrentUserId(res.data.userId);
      })
      .catch((err) => console.error("Get me error:", err));
  }, []);

  useEffect(() => {
    if (activeConversation) {
      inputRef.current?.focus();
    }
  }, [activeConversation]);

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
    const prevConversation = activeConversation;

    setActiveConversation(conversation);

    const msgs = await getMessages(conversation.id);
    setMessages(msgs);

    if (!connectionRef.current) {
      const connection = createSignalRConnection();
      connectionRef.current = connection;

      await connection.start();

      connection.off("ReceiveMessage");
      connection.on("ReceiveMessage", (msg: any) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      });

      connection.onclose((error) => {
        console.error("SignalR disconnected", error);
        window.location.href = "/";
      });
    }

    if (prevConversation) {
      await connectionRef.current.invoke(
        "LeaveConversation",
        prevConversation.id,
      );
    }

    await connectionRef.current.invoke("JoinConversation", conversation.id);
  };
  const formatTime = (iso?: string) => {
    if (!iso) return "";

    // Convert backend format to safe local format
    const localSafe = iso.replace("T", " ").split(".")[0];

    const date = new Date(localSafe);

    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return;

    await connectionRef.current.invoke(
      "SendMessage",
      activeConversation.id,
      messageText,
    );

    setMessageText("");
  };

  return (
    <main
      className={`  top-0b relative  transition-all duration-300 overflow-x-hidden   ${
        isExpanded ? "m-auto w-[calc(93vw-90px)] top-30 h-full   rounded-lg" : "px-5 pt-5"
      }`}
    >
      <div
        className={`flex   bg-[var(--card-bg)]   rounded-lg   shadow-[var(--card-shadow)]  border border-[var(--border-color)] transition-all duration-300 ${
          isExpanded
            ? "w-full   rounded-none   "
            : "w-[92vw] h-[calc(100vh-56px-40px)]  "
        }`}
      >
        {/* CONTACTS SIDEBAR */}
        <aside className="w-[30%] max-w-[350px] min-w-[280px] border-r border-[var(--border-color)] flex flex-col bg-[var(--card-bg)] ">
          <div className="px-5 py-3 border-b border-[var(--border-color)]">
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
                <Avatar
                  text={getAvatarName(c.groupName)}
                  color="from-blue-500 to-blue-400"
                />

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-[var(--text-primary)]">
                    {c.groupName}
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
          <div className="flex justify-between items-center px-5 py-2 border-b border-[var(--border-color)] ">
            <div className="flex items-center gap-3">
              <Avatar
                text={getAvatarName(activeConversation?.groupName)}
                color="from-blue-500 to-blue-400"
              />

              <div>
                <div className="font-semibold text-[var(--text-primary)]">
                  {activeConversation?.groupName}
                </div>

                <div className="text-sm text-[var(--text-secondary)]">Online</div>
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
          <div className="flex-1 overflow-y-auto  p-2 flex flex-col gap-1 bg-[var(--bg-primary)]">
            {messages.map((m) =>
              currentUserId && m.senderId === currentUserId ? (
                <Sent
                  key={m.id}
                  time={formatTime(m.sent_Timestamp)}
                  avatar="ME"
                  color="from-blue-500 to-blue-400"
                >
                  {m.messageText}
                </Sent>
              ) : (
                <Received
                  key={m.id}
                  avatar="US"
                  color="from-gray-500 to-gray-400"
                  time={formatTime(m.sent_Timestamp)}
                >
                  {m.messageText}
                </Received>
              ),
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
              ref={inputRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
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
              onClick={sendMessage}
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
      className={`px-3 size-8 rounded-full flex items-center justify-center text-[var(--text-primary)] text-[12px] font-semibold bg-gradient-to-br ${color}`}
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

function Received({ avatar, color, children, time }: any) {
  return (
    <div className="flex gap-1 max-w-[70%]">
      <Avatar text={avatar} color={color} />
      <div className="text-[var(--text-primary)]">
        <div className="bg-[var(--card-bg)]  border border-[var(--border-color)] rounded-2xl rounded-bl-sm px-4 py-0.5 text-sm">
          {children}
        <div className="text-[8px] text-[var(--text-primary)] text-right  relative left-2">
          {time}
        </div>
        </div>
      </div>
    </div>
  );
}

function Sent({ avatar, color, children, time }: any) {
  return (
    <div className="flex gap-1 max-w-[70%] self-end  ">
      
        <div className="bg-blue-600 text-[var(--text-primary)] rounded-2xl rounded-br-sm py-0.5 px-4  text-sm    ">
          {children}
        <div className="text-[8px] text-[var(--accent-color)] text-right  relative left-3  ">
          {time}
        </div>
        </div>
       
      <Avatar text={avatar} color={color} />
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

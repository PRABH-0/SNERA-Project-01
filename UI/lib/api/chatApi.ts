import API from "./api";

/* =======================
   Types / Interfaces
======================= */

export type ConversationType = "Private" | "Group";

export interface Participant {
  userId: string;
  role: "Member" | "Admin";
}

export interface Conversation {
  id: string;
  conversationType: ConversationType;
  groupName: string | null;
  created_Timestamp: string;
  participants: Participant[];
  messages: Message[]; // list API ch empty aunda
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  messageType: string; // Text / Image etc (as backend defines)
}

/* =======================
   APIs
======================= */

/**
 * 1️⃣ Get all conversations of logged-in user
 * GET /api/chat/conversations
 */
export const getConversations = async (): Promise<Conversation[]> => {
  const res = await API.get("/chat/conversations");
  return res.data;
};

/**
 * 2️⃣ Get messages of a conversation
 * GET /api/chat/{conversationId}/messages
 */
export const getMessages = async (
  conversationId: string
): Promise<Message[]> => {
  const res = await API.get(`/chat/${conversationId}/messages`);
  return res.data;
};

/**
 * 3️⃣ Create/Get private conversation
 * POST /api/chat/private/{receiverId}
 * ❗ No request body
 * ✅ Response gives conversationId
 */
export const createPrivateConversation = async (
  receiverId: string
): Promise<{ conversationId: string }> => {
  const res = await API.post(`/chat/private/${receiverId}`);
  return res.data;
};

/**
 * 4️⃣ Update conversation (PATCH)
 * PATCH /api/chat/conversations/{conversationId}
 */
export interface UpdateConversationPayload {
  groupName?: string;
  conversationType?: ConversationType;
}

export const updateConversation = async (
  conversationId: string,
  payload: UpdateConversationPayload
) => {
  const res = await API.patch(
    `/chat/conversations/${conversationId}`,
    payload
  );
  return res.data;
};

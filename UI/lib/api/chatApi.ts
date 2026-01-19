import API from "./api";

 

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
  messages: Message[];  
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  messageType: string;  
}

 

 
  // Get all conversations of logged-in user
  
 
export const getConversations = async (): Promise<Conversation[]> => {
  const res = await API.get("/chat/conversations");
  return res.data;
};

  // 2️⃣ Get messages of a conversation
 
export const getMessages = async (
  conversationId: string
): Promise<Message[]> => {
  const res = await API.get(`/chat/${conversationId}/messages`);
  return res.data;
};

// 3️⃣ Create/Get private conversation
  
  // Response gives conversationId
 
export const createPrivateConversation = async (
  receiverId: string
): Promise<{ conversationId: string }> => {
  const res = await API.post(`/chat/private/${receiverId}`);
  return res.data;
};

  // 4️⃣ Update conversation (PATCH)
 
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

export type Conversation = {
  id: string;
  conversationType: "Private" | "Group";
  groupName: string | null;
  created_Timestamp: string;
  record_State: "Active";
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
};

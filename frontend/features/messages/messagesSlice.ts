import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Attachment = {
  id: string;
  type: "image";
  url: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: "pending" | "sent" | "delivered" | "read" | "error";
  attachments?: Attachment[];
};

export type Peer = {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  online?: boolean;
};

export type Conversation = {
  id: string;
  peer: Peer;
  lastMessageAt: string;
  unreadCount: number;
  typing?: boolean;
};

interface MessagesState {
  conversations: Conversation[];
  messagesByConv: Record<string, Message[]>;
  activeId?: string;
  loadingConversations: boolean;
  loadingMessages: boolean;
  sending: boolean;
}

const initialState: MessagesState = {
  conversations: [],
  messagesByConv: {},
  activeId: undefined,
  loadingConversations: false,
  loadingMessages: false,
  sending: false,
};

const slice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload.sort((a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt));
    },
    upsertConversation(state, action: PayloadAction<Conversation>) {
      const c = action.payload;
      const idx = state.conversations.findIndex((x) => x.id === c.id);
      if (idx >= 0) state.conversations[idx] = { ...state.conversations[idx], ...c };
      else state.conversations.unshift(c);
      state.conversations.sort((a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt));
    },
    setActive(state, action: PayloadAction<string | undefined>) {
      state.activeId = action.payload;
      if (state.activeId) {
        const conv = state.conversations.find((c) => c.id === state.activeId);
        if (conv) conv.unreadCount = 0;
      }
    },
    setMessages(state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) {
      const { conversationId, messages } = action.payload;
      state.messagesByConv[conversationId] = messages.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    },
    prependMessages(state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) {
      const { conversationId, messages } = action.payload;
      const cur = state.messagesByConv[conversationId] ?? [];
      state.messagesByConv[conversationId] = [...messages, ...cur].sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    },
    addMessage(state, action: PayloadAction<Message>) {
      const m = action.payload;
      const arr = state.messagesByConv[m.conversationId] ?? (state.messagesByConv[m.conversationId] = []);
      arr.push(m);
      arr.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
      const conv = state.conversations.find((c) => c.id === m.conversationId);
      if (conv) {
        conv.lastMessageAt = m.createdAt;
        // If message is not in active conversation, bump unread
        if (state.activeId !== m.conversationId && m.senderId !== "me") conv.unreadCount += 1;
      }
      state.conversations.sort((a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt));
    },
    updateMessage(state, action: PayloadAction<{ conversationId: string; id: string; patch: Partial<Message> }>) {
      const { conversationId, id, patch } = action.payload;
      const arr = state.messagesByConv[conversationId];
      if (!arr) return;
      const idx = arr.findIndex((m) => m.id === id);
      if (idx >= 0) arr[idx] = { ...arr[idx], ...patch };
    },
    setTyping(state, action: PayloadAction<{ conversationId: string; typing: boolean }>) {
      const conv = state.conversations.find((c) => c.id === action.payload.conversationId);
      if (conv) conv.typing = action.payload.typing;
    },
    setPeerOnline(state, action: PayloadAction<{ peerId: string; online: boolean }>) {
      state.conversations.forEach((c) => {
        if (c.peer.id === action.payload.peerId) c.peer.online = action.payload.online;
      });
    },
    markRead(state, action: PayloadAction<{ conversationId: string }>) {
      const conv = state.conversations.find((c) => c.id === action.payload.conversationId);
      if (conv) conv.unreadCount = 0;
      const arr = state.messagesByConv[action.payload.conversationId];
      if (arr) {
        arr.forEach((m) => {
          if (m.status === "delivered") m.status = "read";
        });
      }
    },
    setLoadingConversations(state, action: PayloadAction<boolean>) {
      state.loadingConversations = action.payload;
    },
    setLoadingMessages(state, action: PayloadAction<boolean>) {
      state.loadingMessages = action.payload;
    },
    setSending(state, action: PayloadAction<boolean>) {
      state.sending = action.payload;
    },
  },
});

export const {
  setConversations,
  upsertConversation,
  setActive,
  setMessages,
  prependMessages,
  addMessage,
  updateMessage,
  setTyping,
  setPeerOnline,
  markRead,
  setLoadingConversations,
  setLoadingMessages,
  setSending,
} = slice.actions;

export default slice.reducer;
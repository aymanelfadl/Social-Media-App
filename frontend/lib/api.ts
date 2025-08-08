// TEMP client-side API stubs. Replace with real endpoints later.

export type SearchUser = {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  isFollowing?: boolean;
};

export type SearchPost = {
  id: string;
  content: string;
  createdAt: string;
  images?: string[];
  author: SearchUser;
};

// Existing mock data (search)
const MOCK_USERS: SearchUser[] = [
  { id: "u1", name: "Jane Doe", handle: "jane", avatarUrl: "/images/logo.png", isFollowing: false },
  { id: "u2", name: "Dev Guy", handle: "devguy", avatarUrl: "/images/logo.png", isFollowing: true },
  { id: "u3", name: "Open Source", handle: "oss", isFollowing: false },
];

const MOCK_POSTS: SearchPost[] = [
  {
    id: "p1",
    content: "Building a social app UI with Next.js + Tailwind + Redux. ✨",
    createdAt: new Date().toISOString(),
    images: ["/images/logo.png"],
    author: MOCK_USERS[0]!,
  },
  {
    id: "p2",
    content: "Dark mode support via CSS variables and Tailwind's dark class.",
    createdAt: new Date().toISOString(),
    author: MOCK_USERS[1]!,
  },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function searchAll(query: string): Promise<{ users: SearchUser[]; posts: SearchPost[] }> {
  await delay(250);
  const q = query.trim().toLowerCase();
  if (!q) return { users: [], posts: [] };
  const users = MOCK_USERS.filter((u) => u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q));
  const posts = MOCK_POSTS.filter((p) => p.content.toLowerCase().includes(q) || p.author.handle.toLowerCase().includes(q));
  return { users, posts };
}

export async function followUser(): Promise<{ ok: boolean }> {
  await delay(200);
  return { ok: true };
}
export async function unfollowUser(): Promise<{ ok: boolean }> {
  await delay(200);
  return { ok: true };
}
export async function likePost(): Promise<{ ok: boolean }> {
  await delay(200);
  return { ok: true };
}
export async function repostPost(): Promise<{ ok: boolean }> {
  await delay(200);
  return { ok: true };
}


export type ApiConversation = {
  id: string;
  peer: { id: string; name: string; handle: string; avatarUrl?: string; online?: boolean };
  lastMessageAt: string;
  unreadCount: number;
};

export type ApiMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  attachments?: { id: string; type: "image"; url: string }[];
  status: "sent" | "delivered" | "read";
};

const MOCK_CONVERSATIONS: ApiConversation[] = [
  { id: "c1", peer: { id: "u1", name: "Jane Doe", handle: "jane", avatarUrl: "/images/logo.png", online: true }, lastMessageAt: new Date().toISOString(), unreadCount: 1 },
  { id: "c2", peer: { id: "u2", name: "Dev Guy", handle: "devguy", avatarUrl: "/images/logo.png", online: false }, lastMessageAt: new Date(Date.now() - 86400000).toISOString(), unreadCount: 0 },
];

const MOCK_MESSAGES: Record<string, ApiMessage[]> = {
  c1: [
    { id: "m1", conversationId: "c1", senderId: "u1", text: "Hey there!", createdAt: new Date(Date.now() - 3600_000).toISOString(), status: "read" },
    { id: "m2", conversationId: "c1", senderId: "me", text: "Hi! What's up?", createdAt: new Date(Date.now() - 3500_000).toISOString(), status: "read" },
    { id: "m3", conversationId: "c1", senderId: "u1", text: "Working on the UI now.", createdAt: new Date(Date.now() - 60_000).toISOString(), status: "delivered" },
  ],
  c2: [
    { id: "m4", conversationId: "c2", senderId: "me", text: "Did you check the PR?", createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), status: "read" },
  ],
};

export async function listConversations(): Promise<ApiConversation[]> {
  await delay(200);
  return JSON.parse(JSON.stringify(MOCK_CONVERSATIONS));
}

export async function listMessages(conversationId: string, opts?: { before?: string; limit?: number }): Promise<ApiMessage[]> {
  await delay(250);
  const all = (MOCK_MESSAGES[conversationId] ?? []).slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  let filtered = all;
  if (opts?.before) filtered = all.filter((m) => +new Date(m.createdAt) < +new Date(opts.before!));
  const limit = opts?.limit ?? 20;
  return JSON.parse(JSON.stringify(filtered.slice(0, limit).reverse()));
}

export async function sendMessage(conversationId: string, payload: { text: string; attachments?: { type: "image"; url: string }[] }): Promise<ApiMessage> {
  await delay(300);
  const msg: ApiMessage = {
    id: Math.random().toString(36).slice(2),
    conversationId,
    senderId: "me",
    text: payload.text,
    createdAt: new Date().toISOString(),
    attachments: payload.attachments?.map((a, i) => ({ id: `att-${i}`, ...a })),
    status: "sent",
  };
  
  // Create a copy of MOCK_MESSAGES
  const updatedMessages = { ...MOCK_MESSAGES };
  
  if (!updatedMessages[conversationId]) updatedMessages[conversationId] = [];
  updatedMessages[conversationId] = [...updatedMessages[conversationId], msg];

  
  const conv = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  if (conv) conv.lastMessageAt = msg.createdAt;
  return JSON.parse(JSON.stringify(msg));
}

export async function markConversationRead(conversationId: string): Promise<{ ok: boolean }> {
  await delay(150);
  const conv = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
  if (conv) conv.unreadCount = 0;
  return { ok: true };
}

export async function setTyping(): Promise<{ ok: boolean }> {
  await delay(80);
  return { ok: true };
}

export async function getOrCreateConversationWithUser(userId: string): Promise<ApiConversation> {
  await delay(200);
  let conv = MOCK_CONVERSATIONS.find((c) => c.peer.id === userId);
  if (!conv) {
    const user = MOCK_USERS.find((u) => u.id === userId) ?? { id: userId, name: "User", handle: "user" };
    conv = {
      id: "c" + Math.random().toString(36).slice(2),
      peer: { id: user.id, name: user.name, handle: user.handle, avatarUrl: user.avatarUrl, online: false },
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    };
    MOCK_CONVERSATIONS.unshift(conv);
    
    const updatedMessages = { ...MOCK_MESSAGES };
    updatedMessages[conv.id] = [];
    
  }
  return JSON.parse(JSON.stringify(conv));
}
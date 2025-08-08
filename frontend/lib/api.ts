// Temporary client-side API shims to be replaced by your backend.
// Replace each function body with a real fetch/axios call later.

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
  await delay(250); // simulate latency
  const q = query.trim().toLowerCase();
  if (!q) return { users: [], posts: [] };
  const users = MOCK_USERS.filter((u) => u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q));
  const posts = MOCK_POSTS.filter((p) => p.content.toLowerCase().includes(q) || p.author.handle.toLowerCase().includes(q));
  return { users, posts };
}

export async function followUser(userId: string): Promise<{ ok: boolean }> {
  await delay(200);
  return { ok: true };
}

export async function unfollowUser(userId: string): Promise<{ ok: boolean }> {
  await delay(200);
  return { ok: true };
}

// Optional: stubs you can wire later for post actions
export async function likePost(postId: string, like: boolean): Promise<{ ok: boolean }> {
  await delay(200);
  return { ok: true };
}
export async function repostPost(postId: string, repost: boolean): Promise<{ ok: boolean }> {
  await delay(200);
  return { ok: true };
}
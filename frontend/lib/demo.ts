import type { Post } from "@/features/feed/feedSlice";

export type DemoUser = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
};

interface RandomUserResult {
  login: {
    uuid: string;
  };
  name: {
    first: string;
    last: string;
  };
  picture: {
    medium: string;
  };
}

export async function fetchDemoUsers(count = 12): Promise<DemoUser[]> {
  const res = await fetch(`https://randomuser.me/api/?results=${count}&inc=name,login,picture`);
  const { results } = await res.json();
  return results.map((u: RandomUserResult) => ({
    id: u.login.uuid,
    name: `${u.name.first} ${u.name.last}`,
    handle: `${u.name.first}${u.name.last}`.toLowerCase(),
    avatarUrl: u.picture.medium,
  }));
}

interface JsonPlaceholderPost {
  id: number;
  title: string;
  body: string;
}

export async function fetchDemoPosts(count = 8): Promise<Post[]> {
  const [authors, postsRes] = await Promise.all([
    fetchDemoUsers(count),
    fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${count}`),
  ]);
  const postsJson: JsonPlaceholderPost[] = await postsRes.json();

  const now = Date.now();
  return postsJson.map((p, i): Post => {
    const a = authors[i % authors.length]!;
    const withImage = i % 2 === 0;
    return {
      id: String(p.id),
      author: {
        name: a.name,
        handle: a.handle,
        avatarUrl: a.avatarUrl,
      },
      content: p.title + "\n\n" + p.body,
      createdAt: new Date(now - i * 3600_000).toISOString(),
      images: withImage ? [`https://picsum.photos/seed/post-${p.id}/800/450`] : undefined,
      metrics: {
        replies: Math.floor(Math.random() * 30),
        reposts: Math.floor(Math.random() * 20),
        likes: Math.floor(Math.random() * 200),
        views: 100 + Math.floor(Math.random() * 5000),
      },
    };
  });
}

export async function fetchTrendingImages(count = 8): Promise<string[]> {
  return Array.from({ length: count }).map((_, i) => `https://picsum.photos/seed/trend-${i}/600/400`);
}

export type DemoConversation = {
  id: string;
  peer: DemoUser;
  lastMessageAt: string;
  unread: number;
};

export type DemoMessage = {
  id: string;
  conversationId: string;
  senderId: "me" | "peer";
  text: string;
  createdAt: string;
};

export async function buildDemoConversations(count = 6): Promise<DemoConversation[]> {
  const users = await fetchDemoUsers(count);
  const now = Date.now();
  return users.map((u, i) => ({
    id: `c-${u.id}`,
    peer: u,
    lastMessageAt: new Date(now - i * 7200_000).toISOString(),
    unread: i % 3 === 0 ? 1 + (i % 2) : 0,
  }));
}

export async function buildDemoThread(conversationId: string, peer: DemoUser): Promise<DemoMessage[]> {
  const base = Date.now() - 6 * 3600_000;
  const texts = [
    "Hey! 👋",
    "How's it going?",
    "Just testing this chat UI.",
    "Looks pretty nice!",
    "Let's ship it. 🚀",
  ];
  return texts.map((t, i) => ({
    id: `m-${conversationId}-${i}`,
    conversationId,
    senderId: i % 2 === 0 ? "peer" : "me",
    text: i === 0 ? `Hi, I'm ${peer.name}. ${t}` : t,
    createdAt: new Date(base + i * 30 * 60 * 1000).toISOString(),
  }));
}

export type PostComment = {
  id: string;
  postId: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
};

interface JsonPlaceholderComment {
  id: number;
  postId: number;
  body: string;
}

export async function fetchDemoComments(postId: string, count = 3): Promise<PostComment[]> {
  // Fetch from JSON placeholder API
  const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}&_limit=${count}`);
  const comments: JsonPlaceholderComment[] = await res.json();

  // Get random users for the comments
  const commenters = await fetchDemoUsers(count);

  // Create demo comments with actual users
  return comments.map((comment: JsonPlaceholderComment, index: number): PostComment => {
    const commenter = commenters[index % commenters.length]!;
    return {
      id: String(comment.id),
      postId: String(comment.postId),
      name: commenter.name,
      handle: commenter.handle,
      avatarUrl: commenter.avatarUrl,
      content: comment.body,
      createdAt: new Date(Date.now() - index * 3600_000).toISOString(),
    };
  });
}

interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  following?: string[];
}

// Function to get user-specific posts (posts from the user and those they follow)
export async function getUserPosts(userId: string, count = 5): Promise<Post[]> {
  // First get some demo posts as a base
  const demoPosts = await fetchDemoPosts(count);

  // Get the user profile
  let userProfile: UserProfile | null = null;
  try {
    const userData = localStorage.getItem(`user_${userId}`);
    if (userData) {
      userProfile = JSON.parse(userData);
    }
  } catch (e) {
    console.error("Error loading user profile for posts:", e);
  }

  // If no user profile, just return demo posts
  if (!userProfile) {
    return demoPosts;
  }

  // Create a user post at the top
  const userPost: Post = {
    id: `user-${Date.now()}`,
    author: {
      name: userProfile.name || "You",
      handle: userProfile.handle || "you",
      avatarUrl: userProfile.avatarUrl || "",
    },
    content: "This is my first post! Welcome to my profile.",
    createdAt: new Date().toISOString(),
    images: userProfile.avatarUrl ? [userProfile.avatarUrl] : undefined,
    metrics: {
      replies: 0,
      reposts: 0,
      likes: 2,
      views: 15,
    },
  };

  // Return user's post at the top, followed by demo posts
  return [userPost, ...demoPosts];
}
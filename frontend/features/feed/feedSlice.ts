import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string;
  images?: string[];
  metrics: {
    replies: number;
    reposts: number;
    likes: number;
    views: number;
  };
  liked?: boolean;
  reposted?: boolean;
}

interface FeedState {
  posts: Post[];
  loading: boolean;
}

const initialState: FeedState = {
  posts: [],
  loading: false,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setPosts(state: FeedState, action: PayloadAction<Post[]>) {
      state.posts = action.payload;
    },
    addPost(state: FeedState, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload);
    },
    setLoading(state: FeedState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    toggleLike(state: FeedState, action: PayloadAction<{ id: string }>) {
      const post = state.posts.find((p) => p.id === action.payload.id);
      if (!post) return;
      post.liked = !post.liked;
      post.metrics.likes += post.liked ? 1 : -1;
    },
    toggleRepost(state: FeedState, action: PayloadAction<{ id: string }>) {
      const post = state.posts.find((p) => p.id === action.payload.id);
      if (!post) return;
      post.reposted = !post.reposted;
      post.metrics.reposts += post.reposted ? 1 : -1;
    },
    incrementViews(state: FeedState, action: PayloadAction<{ id: string }>) {
      const post = state.posts.find((p) => p.id === action.payload.id);
      if (!post) return;
      post.metrics.views += 1;
    },
  },
});

export const { setPosts, addPost, setLoading, toggleLike, toggleRepost, incrementViews } = feedSlice.actions;
export default feedSlice.reducer;
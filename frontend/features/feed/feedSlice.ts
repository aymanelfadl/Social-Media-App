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
  },
});

export const { setPosts, addPost, setLoading } = feedSlice.actions;
export default feedSlice.reducer;

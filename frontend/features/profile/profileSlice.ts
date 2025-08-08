import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ProfileUser = {
  id: string;
  name: string;
  handle: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
};

export type FollowUser = {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  isFollowing?: boolean;
};

export type Reply = {
  id: string;
  postId?: string;
  content: string;
  createdAt: string;
};

export type MediaItem = {
  id: string;
  url: string;
  createdAt: string;
};

interface ProfileState {
  me: ProfileUser;
  followers: FollowUser[];
  following: FollowUser[];
  replies: Reply[];
  media: MediaItem[];
}

const initialState: ProfileState = {
  me: {
    id: "me",
    name: "You",
    handle: "you",
    bio: "Bio goes here. Building web apps with Next.js.",
    avatarUrl: "",
    bannerUrl: "",
  },
  followers: [
    { id: "u1", name: "Jane Doe", handle: "jane", avatarUrl: "/images/logo.png", isFollowing: true },
    { id: "u2", name: "Dev Guy", handle: "devguy", avatarUrl: "/images/logo.png", isFollowing: false },
  ],
  following: [
    { id: "u3", name: "Open Source", handle: "oss", avatarUrl: "/images/logo.png", isFollowing: true },
    { id: "u4", name: "Design Pro", handle: "designpro", avatarUrl: "/images/logo.png", isFollowing: true },
  ],
  replies: [
    { id: "r1", content: "Totally agree with this! 🔥", createdAt: new Date().toISOString(), postId: "1" },
    { id: "r2", content: "Thanks for sharing.", createdAt: new Date().toISOString(), postId: "2" },
  ],
  media: [
    { id: "m1", url: "/images/logo.png", createdAt: new Date().toISOString() },
  ],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateMe(state, action: PayloadAction<Partial<ProfileUser>>) {
      state.me = { ...state.me, ...action.payload };
    },
    follow(state, action: PayloadAction<{ id: string }>) {
      const u = state.followers.find((x) => x.id === action.payload.id) ?? state.following.find((x) => x.id === action.payload.id);
      if (u) u.isFollowing = true;
    },
    unfollow(state, action: PayloadAction<{ id: string }>) {
      const u = state.followers.find((x) => x.id === action.payload.id) ?? state.following.find((x) => x.id === action.payload.id);
      if (u) u.isFollowing = false;
    },
    addFollower(state, action: PayloadAction<FollowUser>) {
      state.followers.unshift(action.payload);
    },
    removeFollower(state, action: PayloadAction<{ id: string }>) {
      state.followers = state.followers.filter((x) => x.id !== action.payload.id);
    },
    addFollowing(state, action: PayloadAction<FollowUser>) {
      state.following.unshift(action.payload);
    },
    removeFollowing(state, action: PayloadAction<{ id: string }>) {
      state.following = state.following.filter((x) => x.id !== action.payload.id);
    },
    addReply(state, action: PayloadAction<Reply>) {
      state.replies.unshift(action.payload);
    },
    removeReply(state, action: PayloadAction<{ id: string }>) {
      state.replies = state.replies.filter((r) => r.id !== action.payload.id);
    },
    addMedia(state, action: PayloadAction<MediaItem>) {
      state.media.unshift(action.payload);
    },
    removeMedia(state, action: PayloadAction<{ id: string }>) {
      state.media = state.media.filter((m) => m.id !== action.payload.id);
    },
  },
});

export const {
  updateMe,
  follow,
  unfollow,
  addFollower,
  removeFollower,
  addFollowing,
  removeFollowing,
  addReply,
  removeReply,
  addMedia,
  removeMedia,
} = profileSlice.actions;

export default profileSlice.reducer;
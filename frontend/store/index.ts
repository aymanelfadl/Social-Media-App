import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/features/ui/uiSlice";
import feedReducer from "@/features/feed/feedSlice";
import profileReducer from "@/features/profile/profileSlice";
import messagesReducer from "@/features/messages/messagesSlice";
import authReducer from "@/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    feed: feedReducer,
    profile: profileReducer,
    messages: messagesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
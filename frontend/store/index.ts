import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/features/ui/uiSlice";
import feedReducer from "@/features/feed/feedSlice";
import profileReducer from "@/features/profile/profileSlice";
import messagesReducer from "@/features/messages/messagesSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    feed: feedReducer,
    profile: profileReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserProfile, isLoggedIn } from "@/lib/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id?: string;
    name?: string;
    handle?: string;
    email?: string;
    avatarUrl?: string;
  } | null;
}

// Initialize with null user and check auth status
const initialState: AuthState = {
  isAuthenticated: false, // Will be set on client side
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: any }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    setAuthStatus(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
      
      // If authenticated but no user data, try to get it
      if (action.payload && !state.user) {
        const profile = getUserProfile();
        if (profile) {
          state.user = profile;
        }
      }
      
      // If not authenticated, clear user
      if (!action.payload) {
        state.user = null;
      }
    },
    updateUser(state, action: PayloadAction<Partial<AuthState["user"]>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    }
  },
});

export const { login, logout, setAuthStatus, updateUser } = authSlice.actions;

export default authSlice.reducer;

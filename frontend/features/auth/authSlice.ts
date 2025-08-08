import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserProfile } from "@/lib/auth";

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

export type AuthUser = NonNullable<AuthState["user"]>;

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:
  {
    login(state, action: PayloadAction<{ user: AuthUser }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    setAuthStatus(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
      
      if (action.payload && !state.user) {
        const profile = getUserProfile() as AuthUser | null;
        if (profile) {
          state.user = profile;
        }
      }
      
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

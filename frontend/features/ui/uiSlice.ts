import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
}

const initialState: UIState = {
  theme: "light",
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state: UIState) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme(state: UIState, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    toggleSidebar(state: UIState) {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;

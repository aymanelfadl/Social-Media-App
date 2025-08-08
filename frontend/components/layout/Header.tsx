import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/features/ui/uiSlice";
import type { RootState } from "@/store";
import { Search as SearchIcon, Sun, Moon } from "lucide-react";

export default function Header() {
  const dispatch = useDispatch();
  const theme = useSelector((s: RootState) => s.ui.theme);
  return (
    <header className="px-4 py-3">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold">Home</h1>
        <div className="mx-auto hidden w-full max-w-md sm:block">
          <div className="relative">
            <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Search"
              className="w-full rounded-full border border-neutral-200 bg-neutral-100 pl-9 pr-3 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-900"
            />
          </div>
        </div>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="ml-auto inline-flex items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span className="sr-only">Theme</span>
        </button>
      </div>
    </header>
  );
}

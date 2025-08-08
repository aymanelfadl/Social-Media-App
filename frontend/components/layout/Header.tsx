import { useDispatch } from "react-redux";
import { toggleTheme } from "@/features/ui/uiSlice";

export default function Header() {
  const dispatch = useDispatch();
  return (
    <header className="px-4 py-3">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold">Home</h1>
        <div className="mx-auto hidden w-full max-w-md sm:block">
          <input
            type="search"
            placeholder="Search"
            className="w-full rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm outline-none dark:border-neutral-800 dark:bg-neutral-900"
          />
        </div>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="ml-auto rounded-full border px-3 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          Theme
        </button>
      </div>
    </header>
  );
}

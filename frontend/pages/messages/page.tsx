import { Plus, Search as SearchIcon, Send } from "lucide-react";

export default function Messages() {
  return (
    <div className="grid grid-cols-12 min-h-[70vh]">
      <aside className="hidden sm:block col-span-5 border-r border-neutral-200 dark:border-neutral-800">
        <div className="p-4 flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Search DMs"
              className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 pl-9 pr-3 py-2 text-sm outline-none"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900" aria-label="New message">
            <Plus size={16} />
            <span className="hidden md:inline">New</span>
          </button>
        </div>
        <ul>
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <div className="h-10 w-10 rounded-full bg-neutral-300" />
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight">User {i + 1}</p>
                <p className="text-neutral-500 text-sm truncate">Last message preview…</p>
              </div>
              <span className="inline-flex h-2 w-2 rounded-full bg-sky-500" />
            </li>
          ))}
        </ul>
      </aside>
      <section className="col-span-12 sm:col-span-7">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-bold">Conversation</h2>
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="max-w-[70%] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3">
              Message bubble {i + 1}
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 p-4 border-t border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)]">
          <div className="flex gap-2">
            <input
              placeholder="Write a message"
              className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-transparent px-4 py-2 text-sm outline-none"
            />
            <button className="inline-flex items-center gap-2 rounded-full bg-sky-500 text-white px-4 py-2 hover:bg-sky-600" aria-label="Send">
              <Send size={16} />
              <span className="hidden md:inline">Send</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
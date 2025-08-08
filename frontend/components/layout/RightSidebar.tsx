import { UserPlus } from "lucide-react";

export default function RightSidebar() {
  return (
    <aside className="px-4 py-3 space-y-4">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-xl font-bold">Trends for you</h2>
        <ul className="mt-2 space-y-3 text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex justify-between">
              <div>
                <p className="text-neutral-500">Trending in Tech</p>
                <p className="font-medium">Next.js</p>
              </div>
              <p className="text-neutral-500">12.3K posts</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-xl font-bold">Who to follow</h2>
        <ul className="mt-2 space-y-3 text-sm">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-300" />
              <div className="flex-1">
                <p className="font-medium leading-tight">User {i + 1}</p>
                <p className="text-neutral-500">@user{i + 1}</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900" aria-label={`Follow User ${i + 1}`}>
                <UserPlus size={16} />
                <span>Follow</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default function RightSidebar() {
  return (
    <div className="sticky top-[4.25rem] space-y-4">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60 backdrop-blur p-4">
        <input
          type="search"
          placeholder="Search"
          className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2 text-sm outline-none"
        />
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[var(--card-bg)] p-4">
        <h3 className="mb-3 text-lg font-bold">What’s happening</h3>
        <ul className="space-y-3">
          {["#NextJS", "#TailwindCSS", "#Redux", "#TypeScript"].map((t) => (
            <li key={t} className="group cursor-pointer">
              <p className="text-sm text-neutral-500">Trending</p>
              <p className="font-semibold group-hover:underline">{t}</p>
              <p className="text-sm text-neutral-500">12.3K posts</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[var(--card-bg)] p-4">
        <h3 className="mb-3 text-lg font-bold">Who to follow</h3>
        <ul className="space-y-3">
          {["Jane Doe", "Dev Guy", "Open Source"].map((n, i) => (
            <li key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-neutral-300" />
                <div>
                  <p className="font-medium leading-tight">{n}</p>
                  <p className="text-sm text-neutral-500">@{n.toLowerCase().replace(/\s/g, "")}</p>
                </div>
              </div>
              <button className="rounded-full border px-3 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900">
                Follow
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
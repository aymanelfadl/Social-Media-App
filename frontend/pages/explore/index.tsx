import PostCard from "@/components/feed/Post";
import type { Post } from "@/features/feed/feedSlice";

export default function Explore() {
  const mock: Post = {
    id: "explore",
    author: { name: "Explore", handle: "trends" },
    content: "Explore the latest topics and posts.",
    createdAt: new Date().toISOString(),
    images: ["/images/logo.png", "/images/logo.png", "/images/logo.png", "/images/logo.png"],
    metrics: { replies: 3, reposts: 1, likes: 10, views: 100 },
  };

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-transparent backdrop-blur px-4 py-3">
        <input
          type="search"
          placeholder="Search posts and people"
          className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-2 text-sm outline-none"
        />
      </div>

      <div className="p-4">
        <h2 className="mb-3 text-lg font-bold">Trending</h2>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-video overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
            />
          ))}
        </div>
      </div>

      <PostCard post={mock} />
    </div>
  );
}
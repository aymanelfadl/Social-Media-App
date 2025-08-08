import { MessageCircle, Repeat2, Heart, BarChart3 } from "lucide-react";
import type { Post } from "@/features/feed/feedSlice";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="border-b border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/60 transition-colors">
      <div className="flex gap-3">
        <div className="h-12 w-12 rounded-full bg-neutral-300 overflow-hidden shrink-0">
          {post.author.avatarUrl && (
            <img src={post.author.avatarUrl} alt={post.author.name} className="h-12 w-12 object-cover" loading="lazy" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <header className="flex items-center gap-2 text-sm">
            <span className="font-semibold truncate">{post.author.name}</span>
            <span className="text-neutral-500 truncate">@{post.author.handle} · {new Date(post.createdAt).toLocaleDateString()}</span>
          </header>
          <p className="whitespace-pre-wrap mt-1 text-[15px] break-words">{post.content}</p>

          {post.images && post.images.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
              {post.images.length === 1 && (
                <div className="relative w-full">
                  <img src={post.images[0]!} alt="post image" className="w-full h-auto object-cover" loading="lazy" />
                </div>
              )}

              {post.images.length === 2 && (
                <div className="grid grid-cols-2 gap-0.5">
                  {post.images.map((src, i) => (
                    <img key={i} src={src!} alt="post image" className="w-full h-full object-cover" loading="lazy" />
                  ))}
                </div>
              )}

              {post.images.length === 3 && (
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="col-span-1">
                    <img src={post.images[0]!} alt="post image" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="col-span-1 grid grid-rows-2 gap-0.5">
                    <img src={post.images[1]!} alt="post image" className="w-full h-full object-cover" loading="lazy" />
                    <img src={post.images[2]!} alt="post image" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
              )}

              {post.images.length >= 4 && (
                <div className="grid grid-cols-2 gap-0.5">
                  {post.images.slice(0, 4).map((src, i) => (
                    <img key={i} src={src!} alt="post image" className="w-full h-full object-cover" loading="lazy" />
                  ))}
                </div>
              )}
            </div>
          )}

          <footer className="mt-3 flex justify-between max-w-md text-neutral-500">
            <button aria-label="Reply" className="group inline-flex items-center gap-2 rounded-full px-2 py-1 hover:bg-sky-50 dark:hover:bg-neutral-900 hover:text-sky-600">
              <MessageCircle size={18} />
              <span className="text-xs">{post.metrics.replies}</span>
            </button>
            <button aria-label="Repost" className="group inline-flex items-center gap-2 rounded-full px-2 py-1 hover:bg-green-50 dark:hover:bg-neutral-900 hover:text-green-600">
              <Repeat2 size={18} />
              <span className="text-xs">{post.metrics.reposts}</span>
            </button>
            <button aria-label="Like" className="group inline-flex items-center gap-2 rounded-full px-2 py-1 hover:bg-rose-50 dark:hover:bg-neutral-900 hover:text-rose-600">
              <Heart size={18} />
              <span className="text-xs">{post.metrics.likes}</span>
            </button>
            <div className="inline-flex items-center gap-2 rounded-full px-2 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-900">
              <BarChart3 size={18} />
              <span className="text-xs">{post.metrics.views}</span>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}

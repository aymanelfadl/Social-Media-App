import { MessageCircle, Repeat2, Heart, BarChart3 } from "lucide-react";
import type { Post } from "@/features/feed/feedSlice";
import { useDispatch } from "react-redux";
import { toggleLike, toggleRepost } from "@/features/feed/feedSlice";
import { useState } from "react";

export default function PostCard({ post }: { post: Post }) {
  const dispatch = useDispatch();
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState("");

  return (
    <article className="border-b border-neutral-200 dark:border-neutral-800 p-4 transition-colors hover:bg-neutral-50/70 dark:hover:bg-white/5">
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
            <button
              aria-label="Reply"
              onClick={() => setReplyOpen((v) => !v)}
              className="group inline-flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-sky-50 dark:hover:bg-white/5 hover:text-sky-600"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.metrics.replies}</span>
            </button>
            <button
              aria-label="Repost"
              onClick={() => dispatch(toggleRepost({ id: post.id }))}
              className={`group inline-flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-emerald-50 dark:hover:bg-white/5 ${post.reposted ? "text-emerald-600" : ""}`}
              title={post.reposted ? "Undo repost" : "Repost"}
            >
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs">{post.metrics.reposts}</span>
            </button>
            <button
              aria-label="Like"
              onClick={() => dispatch(toggleLike({ id: post.id }))}
              className={`group inline-flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-rose-50 dark:hover:bg-white/5 ${post.liked ? "text-rose-600" : ""}`}
              title={post.liked ? "Unlike" : "Like"}
            >
              <Heart className="h-4 w-4" />
              <span className="text-xs">{post.metrics.likes}</span>
            </button>
            <button aria-label="Views" className="group inline-flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">{post.metrics.views}</span>
            </button>
          </footer>

          {replyOpen && (
            <form
              className="mt-3 flex items-start gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reply.trim()) return;
                alert(`Reply to ${post.id}: ${reply} (wire API later)`);
                setReply("");
                setReplyOpen(false);
              }}
            >
              <div className="h-8 w-8 rounded-full bg-neutral-300" />
              <div className="flex-1">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={2}
                  placeholder="Write your reply"
                  className="w-full resize-none bg-transparent outline-none rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-2 text-sm"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-full bg-sky-500 px-4 py-2 text-white text-sm hover:bg-sky-600 disabled:opacity-50"
                    disabled={!reply.trim()}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}
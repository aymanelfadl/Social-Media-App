import Image from "next/image";
import { MessageCircle, Repeat2, Heart, BarChart3 } from "lucide-react";
import type { Post } from "@/features/feed/feedSlice";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="border-b border-neutral-200 dark:border-neutral-800 p-4 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/60 transition-colors">
      <div className="flex gap-3">
        <div className="h-12 w-12 rounded-full bg-neutral-300 overflow-hidden shrink-0">
          {post.author.avatarUrl && (
            <Image src={post.author.avatarUrl} alt={post.author.name} width={48} height={48} className="h-12 w-12 object-cover" />
          )}
        </div>
        <div className="flex-1">
          <header className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{post.author.name}</span>
            <span className="text-neutral-500">@{post.author.handle} · {new Date(post.createdAt).toLocaleDateString()}</span>
          </header>
          <p className="whitespace-pre-wrap mt-1 text-[15px]">{post.content}</p>

          {post.images && post.images.length > 0 && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
              {post.images.length === 1 && (
                <Image src={post.images[0]!} alt="post image" width={800} height={450} className="h-auto w-full object-cover" />
              )}

              {post.images.length === 2 && (
                <div className="grid grid-cols-2 gap-0.5">
                  {post.images.map((src, i) => (
                    <Image key={i} src={src!} alt="post image" width={400} height={400} className="h-full w-full object-cover" />
                  ))}
                </div>
              )}

              {post.images.length === 3 && (
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="col-span-1">
                    <Image src={post.images[0]!} alt="post image" width={400} height={600} className="h-full w-full object-cover" />
                  </div>
                  <div className="col-span-1 grid grid-rows-2 gap-0.5">
                    <Image src={post.images[1]!} alt="post image" width={400} height={300} className="h-full w-full object-cover" />
                    <Image src={post.images[2]!} alt="post image" width={400} height={300} className="h-full w-full object-cover" />
                  </div>
                </div>
              )}

              {post.images.length >= 4 && (
                <div className="grid grid-cols-2 gap-0.5">
                  {post.images.slice(0, 4).map((src, i) => (
                    <Image key={i} src={src!} alt="post image" width={400} height={400} className="h-full w-full object-cover" />
                  ))}
                </div>
              )}
            </div>
          )}

          <footer className="mt-3 flex justify-between max-w-md text-neutral-500">
            <button className="group inline-flex items-center gap-2 hover:text-sky-500">
              <MessageCircle size={18} />
              <span className="text-xs">{post.metrics.replies}</span>
            </button>
            <button className="group inline-flex items-center gap-2 hover:text-green-500">
              <Repeat2 size={18} />
              <span className="text-xs">{post.metrics.reposts}</span>
            </button>
            <button className="group inline-flex items-center gap-2 hover:text-rose-500">
              <Heart size={18} />
              <span className="text-xs">{post.metrics.likes}</span>
            </button>
            <div className="inline-flex items-center gap-2">
              <BarChart3 size={18} />
              <span className="text-xs">{post.metrics.views}</span>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}

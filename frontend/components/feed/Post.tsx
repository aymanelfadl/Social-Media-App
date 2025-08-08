import { MessageCircle, Repeat2, Heart, BarChart3 } from "lucide-react";
import type { Post } from "@/features/feed/feedSlice";
import { useDispatch } from "react-redux";
import { toggleLike, toggleRepost } from "@/features/feed/feedSlice";
import { useState } from "react";
import { fetchDemoComments, type PostComment } from "@/lib/demo";
import Image from "next/image";

export default function PostCard({ post }: { post: Post }) {
  const dispatch = useDispatch();
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Helper: detect local blob/data URLs that Next/Image optimizer can't fetch
  const isDataOrBlob = (url?: string) => !!url && (url.startsWith("data:") || url.startsWith("blob:"));
  const authorAvatarUnoptimized = isDataOrBlob(post.author.avatarUrl);

  // Fetch comments when the user clicks to view them
  const loadComments = async () => {
    if (comments.length > 0) {
      // If we already have comments, just toggle visibility
      setShowComments(!showComments);
      return;
    }

    setLoadingComments(true);
    setShowComments(true);

    try {
      const fetchedComments = await fetchDemoComments(post.id, 3);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  return (
    <article className="border-b border-neutral-200 dark:border-neutral-800 p-4 transition-colors hover:bg-neutral-50/70 dark:hover:bg-white/5">
      <div className="flex gap-3">
        <div className="h-12 w-12 rounded-full bg-neutral-300 overflow-hidden shrink-0">
          {post.author.avatarUrl && (
            <Image src={post.author.avatarUrl} alt={post.author.name} width={48} height={48} className="h-12 w-12 object-cover" unoptimized={authorAvatarUnoptimized} />
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
                  {(() => {
                    const src = post.images[0]!;
                    const unopt = isDataOrBlob(src);
                    return (
                      <Image
                        src={src}
                        alt="Post image"
                        width={800}
                        height={450}
                        className="w-full h-auto"
                        unoptimized={unopt}
                      />
                    );
                  })()}
                </div>
              )}
              {post.images.length > 1 && (
                <div className="grid grid-cols-2 gap-1">
                  {post.images.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden bg-neutral-100">
                      <Image src={img} alt={`Post image ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" unoptimized={isDataOrBlob(img)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <footer className="mt-3 flex items-center justify-between text-neutral-500">
            <button
              aria-label="Reply"
              onClick={() => {
                loadComments();
                setReplyOpen(!replyOpen);
              }}
              className="group inline-flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-sky-50 dark:hover:bg-white/5 hover:text-sky-500"
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

          {/* Comments Section */}
          {showComments && (
            <div className="mt-3 border-t border-neutral-200 dark:border-neutral-800 pt-3">
              <h4 className="text-sm font-medium mb-2">Comments</h4>
              {loadingComments ? (
                <div className="text-sm text-neutral-500">Loading comments...</div>
              ) : comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map(comment => (
                    <div key={comment.id} className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-neutral-300 overflow-hidden shrink-0">
                        {comment.avatarUrl && (
                          <Image src={comment.avatarUrl} alt={comment.name} width={32} height={32} className="h-8 w-8 object-cover" unoptimized={isDataOrBlob(comment.avatarUrl)} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-semibold">{comment.name}</span>
                          <span className="text-neutral-500">@{comment.handle}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-neutral-500">No comments yet</div>
              )}
            </div>
          )}

          {replyOpen && (
            <form
              className="mt-3 flex items-start gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reply.trim()) return;

                // Create a new comment from the reply
                const newComment = {
                  id: `temp-${Date.now()}`,
                  postId: post.id,
                  name: "You",
                  handle: "you",
                  content: reply,
                  createdAt: new Date().toISOString()
                };

                // Add the comment to the list
                setComments(prev => [newComment, ...prev]);
                setShowComments(true);

                // Reset form
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
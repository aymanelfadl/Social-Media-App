import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { addPost, setPosts, type Post } from "@/features/feed/feedSlice";
import PostCard from "@/components/feed/Post";
import type { RootState } from "@/store";
import { Feather, Image as ImageIcon } from "lucide-react";
import { fetchDemoPosts } from "@/lib/demo";

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((s: RootState) => s.feed.posts);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const maxLen = 280;
  const remaining = maxLen - text.length;
  const over = remaining < 0;

  useEffect(() => {
    if (posts.length === 0) {
      setLoading(true);
      fetchDemoPosts(8)
        .then((demo) => dispatch(setPosts(demo)))
        .finally(() => setLoading(false));
    }
  }, [dispatch, posts.length]);

  const canPost = useMemo(() => {
    const trimmed = text.trim();
    return (trimmed.length > 0 || imageUrl.trim().length > 0) && !over;
  }, [text, imageUrl, over]);

  const onPost = () => {
    const trimmed = text.trim();
    if (!canPost) return;
    const newPost: Post = {
      id: Math.random().toString(36).slice(2),
      author: { name: "You", handle: "you" },
      content: trimmed,
      createdAt: new Date().toISOString(),
      images: imageUrl ? [imageUrl.trim()] : undefined,
      metrics: { replies: 0, reposts: 0, likes: 0, views: 0 },
    };
    dispatch(addPost(newPost));
    setText("");
    setImageUrl("");
  };

  return (
    <div>
      <div className="border-b border-neutral-200 dark:border-neutral-800 p-4">
        <div className="flex gap-3">
          <div className="h-12 w-12 rounded-full bg-neutral-300 shrink-0" />
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What is happening?!"
              rows={3}
              className="w-full resize-none bg-transparent outline-none placeholder:text-neutral-500"
            />

            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] items-center">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL (optional)"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <div className="flex items-center justify-end gap-3">
                <div className={`text-xs ${over ? "text-rose-600" : "text-neutral-500"}`}>{remaining}</div>
                <button
                  onClick={onPost}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-white hover:bg-sky-600 disabled:opacity-50"
                  disabled={!canPost}
                  aria-label="Post"
                >
                  <Feather size={16} />
                  Post
                </button>
              </div>
            </div>

            {imageUrl.trim() && (
              <div className="mt-3 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl.trim()} alt="preview" className="w-full h-auto object-cover" onError={() => setImageUrl("")} />
              </div>
            )}

            {!imageUrl.trim() && (
              <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                <ImageIcon className="h-4 w-4" />
                Add an image via a URL to preview it here.
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <div className="p-4 text-sm text-neutral-500">Loading feed…</div>}

      <div>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
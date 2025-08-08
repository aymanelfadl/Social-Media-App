import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addPost, setPosts, type Post } from "@/features/feed/feedSlice";
import PostCard from "@/components/feed/Post";
import type { RootState } from "@/store";

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((s: RootState) => s.feed.posts);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // seed demo posts once
    if (posts.length === 0) {
      const demo: Post[] = [
        {
          id: "1",
          author: { name: "Jane Doe", handle: "jane" },
          content: "Building a social app UI with Next.js + Tailwind + Redux. ✨",
          createdAt: new Date().toISOString(),
          images: ["/images/logo.png"],
          metrics: { replies: 12, reposts: 4, likes: 89, views: 1203 },
        },
        {
          id: "2",
          author: { name: "Dev Guy", handle: "devguy" },
          content: "Dark mode support via CSS variables and Tailwind's dark class.",
          createdAt: new Date().toISOString(),
          metrics: { replies: 2, reposts: 3, likes: 20, views: 450 },
        },
      ];
      dispatch(setPosts(demo));
    }
  }, [dispatch, posts.length]);

  const onPost = () => {
    const trimmed = text.trim();
    if (!trimmed && !imageUrl.trim()) return;
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
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL (optional)"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm outline-none"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={onPost} className="rounded-full bg-sky-500 px-4 py-2 text-white hover:bg-sky-600 disabled:opacity-50" disabled={!text.trim() && !imageUrl.trim()}>
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {posts.map((p: Post) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
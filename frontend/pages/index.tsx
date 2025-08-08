import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState, useRef } from "react";
import { addPost, setPosts, type Post } from "@/features/feed/feedSlice";
import PostCard from "@/components/feed/Post";
import type { RootState } from "@/store";
import { Feather, Image as ImageIcon, X } from "lucide-react";
import { fetchDemoPosts, getUserPosts } from "@/lib/demo";
import { isLoggedIn, getAuthToken } from "@/lib/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { shouldUnoptimize } from "@/lib/images";

export default function Home()
{
  const dispatch = useDispatch();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const posts = useSelector((s: RootState) => s.feed.posts);
  const profile = useSelector((s: RootState) => s.profile.me);

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [authenticated, setAuthenticated] = useState(true);

  // Helper for Next/Image on Vercel (optimizer cannot fetch blob:/data:)
  const isDataOrBlob = (url?: string) => !!url && (url.startsWith("data:") || url.startsWith("blob:"));

  const maxLen = 280;
  const remaining = maxLen - text.length;
  const over = remaining < 0;

  useEffect(() =>
  {
    const checkAuth = () => {
      const isAuth = isLoggedIn();
      setAuthenticated(isAuth);
      if (!isAuth) {
        router.push('/explore');
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (authenticated && posts.length === 0) {
      setLoading(true);
      
      const token = getAuthToken();
      if (token) {
        getUserPosts(token, 8)
          .then((userPosts) => dispatch(setPosts(userPosts)))
          .finally(() => setLoading(false));
      } else {
        fetchDemoPosts(8)
          .then((demo) => dispatch(setPosts(demo)))
          .finally(() => setLoading(false));
      }
    }
  }, [dispatch, posts.length, authenticated]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const canPost = useMemo(() => {
    const trimmed = text.trim();
    return (trimmed.length > 0 || selectedFile) && !over;
  }, [text, selectedFile, over]);

  const onPost = () => {
    const trimmed = text.trim();
    if (!canPost) return;
    
    const newPost: Post = {
      id: Math.random().toString(36).slice(2),
      author: { name: profile.name, handle: profile.handle, avatarUrl: profile.avatarUrl },
      content: trimmed,
      createdAt: new Date().toISOString(),
      images: previewUrl ? [previewUrl] : undefined,
      metrics: { replies: 0, reposts: 0, likes: 0, views: 0 },
    };
    
    dispatch(addPost(newPost));
    setText("");
    clearImage();
  };

  if (!authenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to Social App</h2>
        <p className="mb-6">Please sign in to view your personalized feed and create posts.</p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/login" className="rounded-full bg-sky-500 px-6 py-2 text-white font-medium hover:bg-sky-600">
            Log in
          </Link>
          <Link href="/explore" className="rounded-full border border-neutral-200 dark:border-neutral-800 px-6 py-2 font-medium hover:bg-neutral-50 dark:hover:bg-white/5">
            Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-neutral-200 dark:border-neutral-800 p-4">
        <div className="flex gap-3">
           {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full shrink-0 object-cover"
              unoptimized={shouldUnoptimize(profile.avatarUrl)}
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-neutral-300 shrink-0" />
          )}
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What&#39;s happening?!"
              rows={3}
              className="w-full resize-none bg-transparent outline-none placeholder:text-neutral-500"
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm hover:bg-black/20 cursor-pointer"
                  aria-label="Add image"
                >
                  <ImageIcon size={16} />
                  Add Image
                </button>
              </div>
              
              <div className="flex items-center gap-3">
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

            {previewUrl && (
              <div className="mt-3 relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <Image
                  src={previewUrl}
                  alt="Selected image preview"
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {!previewUrl && (
              <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                <ImageIcon className="h-4 w-4" />
                Click &quot;Add Image&quot; to upload a photo.
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
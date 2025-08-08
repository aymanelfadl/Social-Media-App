import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import ProfileHeader from "@/components/profile/ProfileHeader";
import EditProfileModal from "@/components/profile/EditProfileModal";
import UserList from "@/components/profile/UserList";
import PostCard from "@/components/feed/Post";
import { Trash2 } from "lucide-react";
import { fetchDemoUsers } from "@/lib/demo";
import { removeMedia, removeReply } from "@/features/profile/profileSlice";
import { toggleLike } from "@/features/feed/feedSlice";
import { useEffect, useMemo, useState } from "react";
import { isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/router";
import Link from "next/link";

type Tab = "Posts" | "Replies" | "Media" | "Likes";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const me = useSelector((s: RootState) => s.profile.me);
  const replies = useSelector((s: RootState) => s.profile.replies);
  const media = useSelector((s: RootState) => s.profile.media);
  const posts = useSelector((s: RootState) => s.feed.posts);

  const [tab, setTab] = useState<Tab>("Posts");
  const [editOpen, setEditOpen] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(true); // Assume authenticated until client-side check

  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);

  const myPosts = useMemo(
    () => posts.filter((p) => p.author.handle.toLowerCase() === me.handle.toLowerCase()),
    [posts, me.handle]
  );
  const likedPosts = useMemo(() => posts.filter((p) => p.liked), [posts]);

  useEffect(() => {
    // Check authentication on client-side
    const checkAuth = () => {
      const isAuth = isLoggedIn();
      setAuthenticated(isAuth);
      
      // Middleware will handle redirection, but this is a backup
      if (!isAuth) {
        router.push('/auth/login?from=/profile/page');
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (authenticated) {
      Promise.all([fetchDemoUsers(8), fetchDemoUsers(6)]).then(([f1, f2]) => {
        setFollowers(f1);
        setFollowing(f2);
        setLoading(false);
      });
    }
  }, [authenticated]);

  // If not authenticated, show a message with a link to login or explore
  if (!authenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
        <p className="mb-6">You need to be logged in to view and manage your profile.</p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/login?from=/profile/page" className="rounded-full bg-sky-500 px-6 py-2 text-white font-medium hover:bg-sky-600">
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
      <ProfileHeader onEditClick={() => setEditOpen(true)} />

      <div className="px-4 mt-6">
        <div className="mt-4 border-b border-neutral-200 dark:border-neutral-800">
          <ul className="flex">
            {(["Posts", "Replies", "Media", "Likes"] as Tab[]).map((t) => (
              <li
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 cursor-pointer py-3 text-center transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 ${
                  tab === t ? "font-semibold" : ""
                }`}
              >
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-h-[40vh]">
          {tab === "Posts" && (
            <div>
              {myPosts.length === 0 && (
                <div className="p-4 text-sm text-neutral-500">You haven’t posted yet.</div>
              )}
              {myPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}

          {tab === "Replies" && (
            <div>
              {replies.length === 0 && <div className="p-4 text-sm text-neutral-500">No replies yet.</div>}
              <ul>
                {replies.map((r) => (
                  <li
                    key={r.id}
                    className="border-b border-neutral-200 dark:border-neutral-800 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-neutral-500">
                          Replied · {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                        <p className="mt-1 whitespace-pre-wrap">{r.content}</p>
                      </div>
                      <button
                        onClick={() => dispatch(removeReply({ id: r.id }))}
                        className="rounded-full p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5"
                        title="Delete reply"
                        aria-label="Delete reply"
                      >
                        <Trash2 className="h-4 w-4 text-neutral-500" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "Media" && (
            <div className="p-4">
              {media.length === 0 && <div className="text-sm text-neutral-500">No media yet.</div>}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {media.map((m) => (
                  <div
                    key={m.id}
                    className="group relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800"
                  >
                    <img src={m.url} alt="media" className="w-full h-full object-cover" />
                    <button
                      onClick={() => dispatch(removeMedia({ id: m.id }))}
                      className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      title="Remove media"
                      aria-label="Remove media"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Likes" && (
            <div>
              {likedPosts.length === 0 && <div className="p-4 text-sm text-neutral-500">No likes yet.</div>}
              {likedPosts.map((p) => (
                <div key={p.id}>
                  <PostCard post={p} />
                  <div className="px-4 pb-3">
                    <button
                      onClick={() => dispatch(toggleLike({ id: p.id }))}
                      className="rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
                    >
                      Unlike
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-white dark:bg-neutral-900"
            onClick={() => setShowFollowers(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
              <UserList users={followers} title="Followers" />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setShowFollowers(false)}
                  className="bg-neutral-50 rounded-full border px-4 py-2 text-sm transition-colors hover:bg-neutral-400 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFollowing && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-white dark:bg-neutral-900"
            onClick={() => setShowFollowing(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
              <UserList users={following} title="Following" />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setShowFollowing(false)}
                  className="bg-neutral-50 rounded-full border px-4 py-2 text-sm transition-colors hover:bg-neutral-400 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

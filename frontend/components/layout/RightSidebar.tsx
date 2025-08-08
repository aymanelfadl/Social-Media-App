import SearchBar from "@/components/search/SearchBar";
import { useEffect, useState } from "react";
import { followUser, unfollowUser, type SearchUser } from "@/lib/api";

export default function RightSidebar() {
  const [who, setWho] = useState<SearchUser[]>([
    { id: "u1", name: "Jane Doe", handle: "jane", avatarUrl: "/images/logo.png", isFollowing: false },
    { id: "u2", name: "Dev Guy", handle: "devguy", avatarUrl: "/images/logo.png", isFollowing: true },
    { id: "u3", name: "Open Source", handle: "oss", isFollowing: false },
  ]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    // could fetch recommendations here later
  }, []);

  const toggleFollow = async (u: SearchUser) => {
    setBusy(u.id);
    try {
      if (u.isFollowing) await unfollowUser(u.id);
      else await followUser(u.id);
      setWho((prev) => prev.map((x) => (x.id === u.id ? { ...x, isFollowing: !x.isFollowing } : x)));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="sticky top-[4.25rem] space-y-4">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 backdrop-blur p-3">
        <SearchBar
          placeholder="Search"
          onSelectUser={(u) => (window.location.href = `/profile/page?handle=${u.handle}`)}
          onSelectPost={(p) => alert(`Open post ${p.id} (implement route later)`)}
        />
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[var(--card-bg)] p-4">
        <h3 className="mb-3 text-lg font-bold">What’s happening</h3>
        <ul className="space-y-3">
          {["#NextJS", "#TailwindCSS", "#Redux", "#TypeScript"].map((t) => (
            <li key={t} className="group cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 rounded-xl p-2">
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
          {who.map((n) => (
            <li key={n.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-neutral-300 overflow-hidden">
                  {n.avatarUrl && <img src={n.avatarUrl} alt={n.name} className="h-9 w-9 object-cover" />}
                </div>
                <div>
                  <p className="font-medium leading-tight">{n.name}</p>
                  <p className="text-sm text-neutral-500">@{n.handle}</p>
                </div>
              </div>
              <button
                disabled={busy === n.id}
                onClick={() => toggleFollow(n)}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  n.isFollowing
                    ? "border hover:bg-neutral-50 dark:hover:bg-white/5"
                    : "bg-sky-500 text-white hover:bg-sky-600"
                }`}
              >
                {n.isFollowing ? (busy === n.id ? "…" : "Following") : busy === n.id ? "…" : "Follow"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
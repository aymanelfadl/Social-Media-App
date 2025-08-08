import { useEffect, useState } from "react";
import { loadWhoToFollow, saveWhoToFollow, type WhoToFollow } from "@/lib/persist";

// HN Frontpage API (no key): https://hn.algolia.com/api
type HNHit = { objectID: string; title: string; url: string | null; points: number; author: string };

export default function RightSidebar() {
  const [trends, setTrends] = useState<HNHit[]>([]);
  const [who, setWho] = useState<WhoToFollow[]>(loadWhoToFollow());
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [loadingWho, setLoadingWho] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrends() {
      setLoadingTrends(true);
      try {
        const res = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page");
        const json = await res.json();
        setTrends((json.hits as HNHit[]).slice(0, 6));
      } catch {
        setTrends([]);
      } finally {
        setLoadingTrends(false);
      }
    }
    loadTrends();
  }, []);

  useEffect(() => {
    // Seed who-to-follow once if empty
    async function seed() {
      if (who.length > 0) {
        setLoadingWho(false);
        return;
      }
      try {
        const res = await fetch("https://randomuser.me/api/?results=5&inc=name,login,picture");
        const { results } = await res.json();
        const mapped: WhoToFollow[] = results.map((u: any) => ({
          id: u.login.uuid,
          name: `${u.name.first} ${u.name.last}`,
          handle: `${u.name.first}${u.name.last}`.toLowerCase(),
          avatarUrl: u.picture.medium,
          isFollowing: false,
        }));
        setWho(mapped);
        saveWhoToFollow(mapped);
      } catch {}
      setLoadingWho(false);
    }
    seed();
  }, [who.length]);

  const toggleFollow = (id: string) => {
    setBusyId(id);
    setWho((prev) => {
      const next = prev.map((u) => (u.id === id ? { ...u, isFollowing: !u.isFollowing } : u));
      saveWhoToFollow(next);
      return next;
    });
    setTimeout(() => setBusyId(null), 250);
  };

  return (
    <div className="sticky top-[4.25rem] space-y-4">
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 backdrop-blur p-3">
        <input
          type="search"
          placeholder="Search"
          className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm outline-none"
        />
      </div>

      {/* What's happening (live from HN) */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[var(--card-bg)] p-4">
        <h3 className="mb-3 text-lg font-bold">What’s happening</h3>
        {loadingTrends && <div className="text-sm text-neutral-500">Loading…</div>}
        <ul className="space-y-3">
          {trends.map((t) => (
            <li
              key={t.objectID}
              className="group cursor-pointer transition-colors rounded-xl p-2 hover:bg-neutral-50 dark:hover:bg-white/5"
            >
              <a
                href={t.url ?? `https://news.ycombinator.com/item?id=${t.objectID}`}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <p className="font-semibold group-hover:underline">{t.title || "Untitled"}</p>
                <p className="text-sm text-neutral-500">
                  {t.points} points · by {t.author}
                </p>
              </a>
            </li>
          ))}
          {!loadingTrends && trends.length === 0 && (
            <li className="text-sm text-neutral-500">No trends right now.</li>
          )}
        </ul>
      </div>

      {/* Who to follow (RandomUser with local persistence) */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[var(--card-bg)] p-4">
        <h3 className="mb-3 text-lg font-bold">Who to follow</h3>
        <ul className="space-y-3">
          {loadingWho ? (
            <li className="text-sm text-neutral-500">Loading...</li>
          ) : who.length > 0 ? (
            who.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <div className="h-9 w-9 rounded-full bg-neutral-300 overflow-hidden">
                    {n.avatarUrl && <img src={n.avatarUrl} alt={n.name} className="h-9 w-9 object-cover" />}
                  </div>
                  <div>
                    <p className="font-medium leading-tight">{n.name}</p>
                    <p className="text-sm text-neutral-500">@{n.handle}</p>
                  </div>
                </div>
                <button
                  disabled={busyId === n.id}
                  onClick={() => toggleFollow(n.id)}
                  className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                    n.isFollowing
                      ? "border hover:bg-neutral-50 dark:hover:bg-white/5"
                      : "bg-sky-500 text-white hover:bg-sky-600"
                  }`}
                >
                  {n.isFollowing ? (busyId === n.id ? "…" : "Following") : busyId === n.id ? "…" : "Follow"}
                </button>
              </li>
            ))
          ) : (
            <li className="text-sm text-neutral-500">No suggestions.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

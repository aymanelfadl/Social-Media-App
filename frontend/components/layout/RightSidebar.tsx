import { useEffect, useState } from "react";
import { loadWhoToFollow, saveWhoToFollow, type WhoToFollow } from "@/lib/persist";

type HNHit = { objectID: string; title: string; url: string | null; points: number; author: string };

export default function RightSidebar() {
  const [trends, setTrends] = useState<HNHit[]>([]);
  const [loadingTrends, setLoadingTrends] = useState(false);
 
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

  return (
   <div className="sticky top-[1.25rem] h-[calc(100vh-1.25rem)] overflow-y-auto space-y-3 p-4">
  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 backdrop-blur p-3">
    <h3 className="mb-3 text-lg font-bold">Search...</h3>
    <input
      type="search"
      placeholder="What’s in your mind ?"
      className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm outline-none"
    />
  </div>
  <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
    <h3 className="mb-3 text-lg font-bold">What’s happening</h3>
    {loadingTrends && <div className="text-sm text-neutral-500">Loading…</div>}
    <ul className="space-y-2 p-1">
      {trends.map((t) => (
        <li
          key={t.objectID}
          className="group cursor-pointer transition-colors  p-2 hover:bg-neutral-50 dark:hover:bg-white/5 border-b-2"
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
</div>
  );
}

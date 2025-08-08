import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";
import { searchAll, type SearchUser, type SearchPost } from "@/lib/api";
import { Search, Loader2, User, MessageSquareText } from "lucide-react";
import Link from "next/link";

type Props = {
  placeholder?: string;
  autoFocus?: boolean;
  onSelectUser?: (user: SearchUser) => void;
  onSelectPost?: (post: SearchPost) => void;
  className?: string;
};

type Item =
  | { kind: "user"; data: SearchUser }
  | { kind: "post"; data: SearchPost }
  | { kind: "label"; text: string };

export default function SearchBar({
  placeholder = "Search",
  autoFocus,
  onSelectUser,
  onSelectPost,
  className = "",
}: Props) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const debounced = useDebounce(value, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

//   useClickOutside(containerRef, () => setOpen(false));

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (debounced.trim().length < 2) {
        setUsers([]);
        setPosts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { users, posts } = await searchAll(debounced);
      if (!cancelled) {
        setUsers(users);
        setPosts(posts);
        setLoading(false);
        setOpen(true);
        setActiveIndex(0);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const items: Item[] = useMemo(() => {
    const list: Item[] = [];
    if (users.length) {
      list.push({ kind: "label", text: "People" });
      users.forEach((u) => list.push({ kind: "user", data: u }));
    }
    if (posts.length) {
      list.push({ kind: "label", text: "Posts" });
      posts.forEach((p) => list.push({ kind: "post", data: p }));
    }
    return list;
  }, [users, posts]);

  const moveActive = (dir: 1 | -1) => {
    if (!items.length) return;
    let idx = activeIndex + dir;
    // skip labels
    while (idx >= 0 && idx < items.length && items[idx]?.kind === "label") {
      idx += dir;
    }
    if (idx < 0) {
      // wrap to last item
      idx = items.length - 1;
      while (idx >= 0 && items[idx]?.kind === "label") idx--;
    } else if (idx >= items.length) {
      idx = 0;
      while (idx < items.length && items[idx]?.kind === "label") idx++;
    }
    setActiveIndex(Math.max(0, Math.min(items.length - 1, idx)));
  };

  const handleEnter = () => {
    const item = items[activeIndex];
    if (!item || item.kind === "label") return;
    if (item.kind === "user") {
      onSelectUser?.(item.data);
    } else if (item.kind === "post") {
      onSelectPost?.(item.data);
    }
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800  px-3 py-2">
        <Search className="h-4 w-4 " />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => { if ((users.length || posts.length) && value.length >= 2) setOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); moveActive(1); }
            else if (e.key === "ArrowUp") { e.preventDefault(); moveActive(-1); }
            else if (e.key === "Enter") { e.preventDefault(); handleEnter(); }
            else if (e.key === "Escape") { setOpen(false); }
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent outline-none text-sm"
        />
        {loading && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
      </div>

      {open && (loading || items.length > 0) && (
        <div className="absolute z-30 mt-2 w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[var(--card-bg)] shadow-lg backdrop-blur overflow-hidden">
          {loading && (
            <div className="p-3 text-sm text-neutral-500">Searching…</div>
          )}

          {!loading && items.length === 0 && (
            <div className="p-3 text-sm text-neutral-500">No results</div>
          )}

          {!loading && items.length > 0 && (
            <ul className="max-h-[60vh] overflow-auto py-1">
              {items.map((it, i) => {
                if (it.kind === "label") {
                  return (
                    <li key={`label-${it.text}-${i}`} className="px-3 py-2 text-xs uppercase tracking-wide text-neutral-500">
                      {it.text}
                    </li>
                  );
                }
                const active = i === activeIndex;
                if (it.kind === "user") {
                  const u = it.data;
                  return (
                    <li
                      key={`user-${u.id}`}
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { onSelectUser?.(u); setOpen(false); }}
                      className={`flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 ${active ? "bg-neutral-50 dark:bg-white/10" : ""}`}
                    >
                      <div className="h-8 w-8 rounded-full bg-neutral-300 overflow-hidden">
                        {u.avatarUrl && <img src={u.avatarUrl} alt={u.name} className="h-8 w-8 object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="truncate font-medium">{u.name}</span>
                          <span className="truncate text-neutral-500">@{u.handle}</span>
                        </div>
                      </div>
                      <Link href={`/profile/page?handle=${u.handle}`} className="text-xs text-sky-600 hover:underline" onClick={(e)=>e.stopPropagation()}>
                        View
                      </Link>
                    </li>
                  );
                } else {
                  const p = it.data;
                  return (
                    <li
                      key={`post-${p.id}`}
                      onMouseEnter={() => setActiveIndex(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { onSelectPost?.(p); setOpen(false); }}
                      className={`flex cursor-pointer items-start gap-3 px-3 py-2 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 ${active ? "bg-neutral-50 dark:bg-white/10" : ""}`}
                    >
                      <div className="h-8 w-8 rounded-full bg-neutral-300 overflow-hidden shrink-0">
                        {p.author.avatarUrl && <img src={p.author.avatarUrl} alt={p.author.name} className="h-8 w-8 object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <MessageSquareText className="h-3.5 w-3.5" />
                          <span className="truncate">@{p.author.handle}</span>
                          <span>·</span>
                          <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="truncate text-sm">{p.content}</p>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
import { useEffect, useMemo, useRef, useState } from "react";
import { buildDemoConversations, buildDemoThread, type DemoConversation, type DemoMessage } from "@/lib/demo";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Image from "next/image";

export default function Messages() {
  const router = useRouter();
  const [convs, setConvs] = useState<DemoConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [draft, setDraft] = useState("");
  const tickerRef = useRef<number | null>(null);
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const activeConv = useMemo(() => convs.find((c) => c.id === activeId), [convs, activeId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?from=/messages/page');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      buildDemoConversations(8).then((c) => {
        setConvs(c);
        if (c[0]) setActiveId(c[0].id);
      });
    }
    return () => {
      if (tickerRef.current) window.clearInterval(tickerRef.current);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!activeConv) return;
    buildDemoThread(activeConv.id, activeConv.peer).then((msgs) => setMessages(msgs));
    if (tickerRef.current) window.clearInterval(tickerRef.current);
    tickerRef.current = window.setInterval(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: "in-" + Math.random().toString(36).slice(2),
          conversationId: activeConv.id,
          senderId: "peer",
          text: ["Nice!", "Got it.", "Thanks!", "See you soon.", "🔥"][Math.floor(Math.random() * 5)]!,
          createdAt: new Date().toISOString(),
        },
      ]);
      setConvs((prev) =>
        prev
          .map((c) => (c.id === activeConv.id ? { ...c, lastMessageAt: new Date().toISOString() } : c))
          .sort((a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt)),
      );
    }, 12000);

    return () => {
      if (tickerRef.current) window.clearInterval(tickerRef.current);
    };
  }, [activeConv]);

  const onSend = () => {
    const t = draft.trim();
    if (!t || !activeConv) return;
    setMessages((prev) => [
      ...prev,
      {
        id: "me-" + Math.random().toString(36).slice(2),
        conversationId: activeConv.id,
        senderId: "me",
        text: t,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign In to View Messages</h2>
        <p className="mb-6">You need to be logged in to access your messages.</p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/login?from=/messages/page" className="rounded-full bg-sky-500 px-6 py-2 text-white font-medium hover:bg-sky-600">
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
    <div className="grid grid-cols-12 min-h-[70vh]">
      <aside className="hidden sm:block col-span-5 border-r border-neutral-200 dark:border-neutral-800">
        <div className="p-4">
          <input
            type="search"
            placeholder="Search DMs"
            className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-2 text-sm outline-none"
          />
        </div>
        <ul>
          {convs.map((c) => (
            <li
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 ${
                activeId === c.id ? "bg-neutral-50 dark:bg-white/10" : ""
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-neutral-300 overflow-hidden">
                <Image src={c.peer.avatarUrl} alt={c.peer.name} width={40} height={40} className="h-10 w-10 object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-tight truncate">{c.peer.name}</p>
                <p className="text-neutral-500 text-sm truncate">@{c.peer.handle}</p>
              </div>
              {c.unread > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-xs font-semibold text-white">
                  {c.unread}
                </span>
              )}
            </li>
          ))}
          {convs.length === 0 && <li className="p-4 text-sm text-neutral-500">Loading…</li>}
        </ul>
      </aside>

      <section className="col-span-12 sm:col-span-7 flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          {activeConv ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-neutral-300 overflow-hidden">
                <Image src={activeConv.peer.avatarUrl} alt={activeConv.peer.name} width={32} height={32} className="h-8 w-8 object-cover" />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">{activeConv.peer.name}</h2>
                <p className="text-sm text-neutral-500">@{activeConv.peer.handle}</p>
              </div>
            </div>
          ) : (
            <h2 className="text-lg font-bold">Conversation</h2>
          )}
        </div>

        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {activeConv ? (
            messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[70%] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-3 ${
                  m.senderId === "me" ? "ml-auto" : ""
                } transition-colors hover:bg-neutral-50 dark:hover:bg-white/5`}
              >
                <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                <div className="mt-1 text-right text-[11px] text-neutral-500">{new Date(m.createdAt).toLocaleTimeString()}</div>
              </div>
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-500">Select a conversation</div>
          )}
        </div>

        <div className="sticky bottom-0 p-4 border-t border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)]">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              onSend();
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message"
              className="flex-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-transparent px-4 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-sky-500 px-4 py-2 text-white hover:bg-sky-600 disabled:opacity-50"
              disabled={!draft.trim() || !activeConv}
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
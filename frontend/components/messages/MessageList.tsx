import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markRead, prependMessages, setLoadingMessages, setMessages } from "@/features/messages/messagesSlice";
import type { RootState } from "@/store";
import { listMessages } from "@/lib/api";
import MessageBubble from "./MessageBubble";

export default function MessageList({ conversationId }: { conversationId: string }) {
  const dispatch = useDispatch();
  const messages = useSelector((s: RootState) => s.messages.messagesByConv[conversationId] ?? []);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    dispatch(setLoadingMessages(true));
    listMessages(conversationId).then((msgs) => {
      if (!mounted) return;
      dispatch(setMessages({ conversationId, messages: msgs }));
      setHasMore(msgs.length >= 20);
      dispatch(setLoadingMessages(false));
      dispatch(markRead({ conversationId }));
      // Scroll to bottom on load
      setTimeout(() => {
        if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
      }, 0);
    });
    return () => {
      mounted = false;
    };
  }, [conversationId, dispatch]);

  const loadMore = async () => {
    if (!messages.length || loadingMore || !hasMore) return;
    setLoadingMore(true);
    const oldest = messages[0];
    const older = await listMessages(conversationId, { before: oldest.createdAt, limit: 20 });
    dispatch(prependMessages({ conversationId, messages: older }));
    setHasMore(older.length >= 20);
    setLoadingMore(false);
    // Keep scroll position roughly
    topRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div ref={scrollerRef} className="p-4 space-y-3 overflow-y-auto h-[calc(70vh-56px-64px)]">
      {hasMore && (
        <div className="flex justify-center">
          <button onClick={loadMore} disabled={loadingMore} className="rounded-full border px-3 py-1.5 text-xs transition-colors hover:bg-neutral-50 dark:hover:bg-white/5">
            {loadingMore ? "Loading..." : "Load older messages"}
          </button>
        </div>
      )}
      <div ref={topRef} />
      {messages.map((m) => (
        <MessageBubble key={m.id} m={m} mine={m.senderId === "me"} />
      ))}
    </div>
  );
}
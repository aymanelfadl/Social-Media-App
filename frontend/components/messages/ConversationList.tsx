import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActive, setConversations, setTyping } from "@/features/messages/messagesSlice";
import type { RootState } from "@/store";
import { listConversations } from "@/lib/api";
import ConversationItem from "./ConversationItem";

export default function ConversationList() {
  const dispatch = useDispatch();
  const conversations = useSelector((s: RootState) => s.messages.conversations);
  const activeId = useSelector((s: RootState) => s.messages.activeId);

  useEffect(() => {
    let mounted = true;
    listConversations().then((convs) => {
      if (!mounted) return;
      // typing flags come from realtime; initialize false
      dispatch(setConversations(convs));
      // Optionally pick first conversation
      if (!activeId && convs[0]) dispatch(setActive(convs[0].id));
    });
    return () => {
      mounted = false;
      // Clear typing flags
      conversations.forEach((c) => dispatch(setTyping({ conversationId: c.id, typing: false })));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <aside className="hidden sm:block col-span-5 border-r border-neutral-200 dark:border-neutral-800">
      <div className="p-4">
        <input
          type="search"
          placeholder="Search DMs"
          className="w-full rounded-full border border-neutral-200 dark:border-neutral-800  px-4 py-2 text-sm outline-none"
          onChange={() => {}}
        />
      </div>
      <ul>
        {conversations.map((c) => (
          <ConversationItem key={c.id} conv={c} active={activeId === c.id} onClick={() => dispatch(setActive(c.id))} />
        ))}
        {conversations.length === 0 && <li className="p-4 text-sm text-neutral-500">No conversations yet.</li>}
      </ul>
    </aside>
  );
}
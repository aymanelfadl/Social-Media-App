import { ApiConversation } from "@/lib/api";
import Image from "next/image";

export default function ConversationItem({
  conv,
  active,
  onClick,
}: {
  conv: ApiConversation & { typing?: boolean };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 ${
        active ? "bg-neutral-50 dark:bg-white/10" : ""
      }`}
    >
      <div className="h-10 w-10 rounded-full bg-neutral-300 overflow-hidden relative">
        {conv.peer.avatarUrl && (
          <Image
            src={conv.peer.avatarUrl}
            alt={conv.peer.name}
            width={40}
            height={40}
            className="h-10 w-10 object-cover"
          />
        )}
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--card-bg)] ${
            conv.peer.online ? "bg-emerald-500" : "bg-neutral-400"
          }`}
          title={conv.peer.online ? "Online" : "Offline"}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium leading-tight truncate">{conv.peer.name}</p>
          <span className="text-xs text-neutral-500">
            {new Date(conv.lastMessageAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm text-neutral-500">
            {conv.typing ? "Typing…" : `@${conv.peer.handle}`}
          </p>
          {conv.unreadCount > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-xs font-semibold text-white">
              {conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
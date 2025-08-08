import { Message } from "@/features/messages/messagesSlice";

export default function MessageBubble({ m, mine }: { m: Message; mine: boolean }) {
  return (
    <div className={`max-w-[75%] rounded-2xl border p-3 ${mine ? "ml-auto" : ""} border-neutral-200 dark:border-neutral-800 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5`}>
      {m.text && <div className="whitespace-pre-wrap text-sm">{m.text}</div>}
      {m.attachments?.length ? (
        <div className="mt-2 grid grid-cols-2 gap-1">
          {m.attachments.map((a) => (
            <div key={a.id} className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.url} alt="attachment" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-1 flex items-center justify-end gap-2">
        <span className="text-[11px] text-neutral-500">{new Date(m.createdAt).toLocaleTimeString()}</span>
        {mine && (
          <span className="text-[11px] text-neutral-500">
            {m.status === "pending" && "…"}
            {m.status === "sent" && "Sent"}
            {m.status === "delivered" && "Delivered"}
            {m.status === "read" && "Read"}
            {m.status === "error" && "Error"}
          </span>
        )}
      </div>
    </div>
  );
}
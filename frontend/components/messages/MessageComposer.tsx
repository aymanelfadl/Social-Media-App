import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addMessage, setSending, updateMessage } from "@/features/messages/messagesSlice";
import { sendMessage, setTyping } from "@/lib/api";
import { Image as ImageIcon, SendHorizonal, X } from "lucide-react";

export default function MessageComposer({ conversationId }: { conversationId: string }) {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isTyping, setTypingState] = useState(false);
  const typingTimeout = useRef<number | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
    };
  }, []);

  const emitTyping = async (value: boolean) => {
    setTypingState(value);
    try {
      await setTyping();
    } catch {}
  };

  const onChange = (v: string) => {
    setText(v);
    if (!isTyping) {
      emitTyping(true);
    }
    if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
    typingTimeout.current = window.setTimeout(() => {
      emitTyping(false);
    }, 1000);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && images.length === 0) return;

    dispatch(setSending(true));
    const tempId = "tmp-" + Math.random().toString(36).slice(2);
    const now = new Date().toISOString();

    dispatch(
      addMessage({
        id: tempId,
        conversationId,
        senderId: "me",
        text: trimmed,
        createdAt: now,
        status: "pending",
        attachments: images.map((url, i) => ({ id: `tmp-att-${i}`, type: "image" as const, url })),
      }),
    );

    setText("");
    setImages([]);
    taRef.current?.focus();

    try {
      const sent = await sendMessage(conversationId, {
        text: trimmed,
        attachments: images.map((url) => ({ type: "image" as const, url })),
      });
      dispatch(
        updateMessage({
          conversationId,
          id: tempId,
          patch: { id: sent.id, status: "sent", createdAt: sent.createdAt },
        }),
      );
    } catch (e) {
      dispatch(updateMessage({ conversationId, id: tempId, patch: { status: "error" } }));
    } finally {
      dispatch(setSending(false));
    }
  };

  return (
    <form
      className="flex flex-col gap-2 p-4 border-t border-neutral-200 dark:border-neutral-800 bg-[var(--color-background)]"
      onSubmit={onSubmit}
    >
      {images.length > 0 && (
        <div className="flex gap-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative h-16 w-16 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="attachment" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute -right-2 -top-2 rounded-full bg-black/60 p-1 text-white"
                onClick={() => setImages((arr) => arr.filter((_, i) => i !== idx))}
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <button
          type="button"
          className="rounded-full p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5"
          onClick={() => {
            const url = prompt("Paste image URL");
            if (url) setImages((arr) => [...arr, url]);
          }}
          title="Attach image"
          aria-label="Attach image"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          rows={1}
          placeholder="Write a message"
          className="flex-1 resize-none rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e as unknown as FormEvent);
            }
          }}
        />

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-white hover:bg-sky-600 disabled:opacity-50"
          disabled={!text.trim() && images.length === 0}
        >
          <SendHorizonal className="h-4 w-4" />
          Send
        </button>
      </div>
    </form>
  );
}
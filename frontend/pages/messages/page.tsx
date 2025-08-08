import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import ConversationList from "@/components/messages/ConversationList";
import MessageList from "@/components/messages/MessageList";
import MessageComposer from "@/components/messages/MessageComposer";
import {
  markRead,
  setActive,
  setTyping,
  addMessage,
  setPeerOnline,
} from "@/features/messages/messagesSlice";
import { onMessage, onPresence, onTyping } from "@/lib/realtime";

export default function Messages() {
  const dispatch = useDispatch();
  const activeId = useSelector((s: RootState) => s.messages.activeId);
  const activeConv = useSelector((s: RootState) =>
    s.messages.conversations.find((c) => c.id === s.messages.activeId)
  );

  useEffect(() => {
    const offMsg = onMessage((e) => {
      dispatch(
        addMessage({
          id: e.id,
          conversationId: e.conversationId,
          senderId: e.senderId,
          text: e.text,
          createdAt: e.createdAt,
          status: e.senderId === "me" ? "sent" : "delivered",
        })
      );
      if (activeId === e.conversationId) {
        dispatch(markRead({ conversationId: e.conversationId }));
      }
    });

    const offTyping = onTyping((e) => {
      dispatch(setTyping({ conversationId: e.conversationId, typing: e.typing }));
    });

    const offPresence = onPresence((e) => {
      dispatch(setPeerOnline({ peerId: e.peerId, online: e.online }));
    });

    return () => {
      offMsg();
      offTyping();
      offPresence();
    };
  }, [dispatch, activeId]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    if (id) dispatch(setActive(id));
  }, [dispatch]);

  return (
    <div className="grid grid-cols-12 h-full border-b border-neutral-200 dark:border-neutral-800  ">
      <ConversationList />
      <section className="col-span-12 sm:col-span-7 flex flex-col h-screen">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          {activeConv ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-neutral-300 overflow-hidden relative">
                {activeConv.peer.avatarUrl && (
                  <img
                    src={activeConv.peer.avatarUrl}
                    alt={activeConv.peer.name}
                    className="h-8 w-8 object-cover"
                  />
                )}
                <span
                  className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-[var(--card-bg)] ${
                    activeConv.peer.online
                      ? "bg-emerald-500"
                      : "bg-neutral-400"
                  }`}
                  title={activeConv.peer.online ? "Online" : "Offline"}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  {activeConv.peer.name}
                </h2>
                <p className="text-sm text-neutral-500">
                  @{activeConv.peer.handle}
                  {activeConv.typing ? " · typing…" : ""}
                </p>
              </div>
            </div>
          ) : (
            <h2 className="text-lg font-bold">Conversation</h2>
          )}
        </div>

        {activeId ? (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto">
              <MessageList conversationId={activeId} />
            </div>
            <div className="flex-shrink-0">
              <MessageComposer conversationId={activeId} />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-neutral-500">
            Select a conversation to start messaging
          </div>
        )}
      </section>
    </div>
  );
}

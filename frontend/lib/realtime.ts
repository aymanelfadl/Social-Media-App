// Minimal realtime abstraction to swap with WebSocket/SSE later.
type MessageEvent = {
  conversationId: string;
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
};

type TypingEvent = { conversationId: string; typing: boolean };
type PresenceEvent = { peerId: string; online: boolean };

type Handlers = {
  message: ((e: MessageEvent) => void)[];
  typing: ((e: TypingEvent) => void)[];
  presence: ((e: PresenceEvent) => void)[];
};

const handlers: Handlers = { message: [], typing: [], presence: [] };

export function onMessage(cb: (e: MessageEvent) => void) {
  handlers.message.push(cb);
  return () => {
    const i = handlers.message.indexOf(cb);
    if (i >= 0) handlers.message.splice(i, 1);
  };
}
export function onTyping(cb: (e: TypingEvent) => void) {
  handlers.typing.push(cb);
  return () => {
    const i = handlers.typing.indexOf(cb);
    if (i >= 0) handlers.typing.splice(i, 1);
  };
}
export function onPresence(cb: (e: PresenceEvent) => void) {
  handlers.presence.push(cb);
  return () => {
    const i = handlers.presence.indexOf(cb);
    if (i >= 0) handlers.presence.splice(i, 1);
  };
}

// Simulate incoming events for demo/testing
export function simulateIncomingMessage(e: MessageEvent) {
  handlers.message.forEach((h) => h(e));
}
export function simulateTyping(e: TypingEvent) {
  handlers.typing.forEach((h) => h(e));
}
export function simulatePresence(e: PresenceEvent) {
  handlers.presence.forEach((h) => h(e));
}
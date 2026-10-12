// A tiny publish/subscribe bus, used for toasts and for opening the glossary from anywhere.
type Handler = (payload: any) => void;
const handlers = new Map<string, Set<Handler>>();

export function on(evt: string, h: Handler) {
  if (!handlers.has(evt)) handlers.set(evt, new Set());
  handlers.get(evt)!.add(h);
  return () => { handlers.get(evt)?.delete(h); };
}

export function emit(evt: string, payload?: unknown) {
  handlers.get(evt)?.forEach((h) => h(payload));
}

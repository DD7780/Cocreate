// The client also allows ten seconds for ingress and authorized reply queues.
export const DOCUMENT_SAVE_TIMEOUT_MS = 20_000;
export const DOCUMENT_FLUSH_WAIT_MS = DOCUMENT_SAVE_TIMEOUT_MS + 10_000;

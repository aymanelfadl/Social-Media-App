// Utility to decide when Next/Image should bypass the optimizer.
// With a minimal next.config (no images.domains), any remote (http/https)
// or local data/blob URL should be rendered with `unoptimized`.
export function shouldUnoptimize(url?: string): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:");
}

import { ReactNode, useEffect } from "react";

export default function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/95 shadow-xl">
          {title && (
            <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
              <h3 className="text-lg font-bold text-black">{title}</h3>
            </div>
          )}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
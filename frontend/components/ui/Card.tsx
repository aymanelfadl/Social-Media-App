import { ReactNode } from "react";

export default function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-[var(--card-bg)] ${className}`}>
      {children}
    </div>
  );
}
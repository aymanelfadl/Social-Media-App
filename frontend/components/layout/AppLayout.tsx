import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-20 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-[var(--color-background)]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-sky-500" />
            <span className="font-semibold">Social App</span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-300">
            <a href="/explore" className="hover:text-foreground">Explore</a>
            <a href="/messages/page" className="hover:text-foreground">Messages</a>
            <a href="/profile/page" className="hover:text-foreground">Profile</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Left nav */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-3 py-4">
            <Sidebar />
          </aside>

          {/* Main content */}
          <section className="col-span-12 md:col-span-9 lg:col-span-6 border-x border-neutral-200 dark:border-neutral-800 min-h-[70vh]">
            {children}
          </section>

          {/* Right rail */}
          <aside className="hidden lg:block lg:col-span-3 py-4">
            <RightSidebar />
          </aside>
        </div>
      </main>
    </div>
  );
}
import Sidebar from '@/components/layout/Sidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)", color: "var(--color-text)" }}>
      <div className="mx-auto max-w-7xl px-0 sm:px-2">
        <div className="grid grid-cols-12 gap-0">
          {/* Left sidebar */}
          <div className="hidden sm:block sm:col-span-2 xl:col-span-3 border-r border-neutral-200 dark:border-neutral-800 min-h-screen">
            <div className="sticky top-0 h-screen">
              <Sidebar />
            </div>
          </div>

          {/* Center feed */}
          <div className="col-span-12 sm:col-span-10 xl:col-span-6 min-h-screen border-r border-neutral-200 dark:border-neutral-800">
            <div className="sticky top-0 z-10 border-b border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur">
              <Header />
            </div>
            <main className="min-h-screen">
              {children}
            </main>
          </div>

          {/* Right sidebar */}
          <div className="hidden xl:block xl:col-span-3">
            <div className="sticky top-0 h-screen overflow-y-auto py-2">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="sm:hidden">
        <MobileNav />
      </div>
    </div>
  );
}

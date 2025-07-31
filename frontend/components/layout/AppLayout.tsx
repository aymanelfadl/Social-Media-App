import Sidebar from '@/components/layout/Sidebar';
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 bg-green-100">
        {children}
      </main>
    </div>
  );
}

import Sidebar from '@/components/layout/Sidebar'
import { ReactNode } from 'react'

export default function AppLayout({ children }: { children : ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-40 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  )
}

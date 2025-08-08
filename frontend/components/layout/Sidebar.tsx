import Link from "next/link";
import { Home, Search, Mail, User, Feather } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="h-full px-2 py-3 flex flex-col">
      <nav className="flex flex-col gap-1 pr-2">
        <Link
          href="/"
          className="flex items-center gap-4 rounded-full px-4 py-3 text-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
          <Home size={24} />{" "}
          <span className="hidden xl:inline">Home</span>
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-4 rounded-full px-4 py-3 text-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
          <Search size={24} />{" "}
          <span className="hidden xl:inline">Explore</span>
        </Link>
        <Link
          href="/messages"
          className="flex items-center gap-4 rounded-full px-4 py-3 text-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
          <span className="relative inline-flex">
            <Mail size={24} />
            <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </span>
          <span className="hidden xl:inline">Messages</span>
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-4 rounded-full px-4 py-3 text-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900"
        >
          <User size={24} />{" "}
          <span className="hidden xl:inline">Profile</span>
        </Link>
      </nav>
      <div className="mt-3">
        <button className="w-full rounded-full bg-sky-500 px-6 py-3 text-center text-white hover:bg-sky-600 flex items-center justify-center gap-2">
          <Feather size={18} />{" "}
          <span className="hidden xl:inline">Post</span>
        </button>
      </div>
      <div className="mt-auto flex items-center gap-3 rounded-2xl p-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
        <div className="h-10 w-10 rounded-full bg-neutral-300" />
        <div className="hidden xl:block">
          <p className="font-medium leading-tight">You</p>
          <p className="text-neutral-500">@you</p>
        </div>
      </div>
    </aside>
  );
}

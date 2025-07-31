import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="h-screen w-60 flex-col p-4 shadow-md">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="hover:bg-red-200 p-2 rounded">
          Home
        </Link>
        <Link href="/explore" className="hover:bg-red-200 p-2 rounded">
          Explore
        </Link>
        <Link href="/messages" className="hover:bg-red-200 p-2 rounded">
          Messages
        </Link>
        <Link href="/profile" className="hover:bg-red-200 p-2 rounded">
          Profile
        </Link>
      </nav>
    </aside>
  );
}

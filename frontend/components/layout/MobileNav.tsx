import Link from "next/link";
import { Home, Search, Mail, User } from "lucide-react";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-200 bg-white/90 backdrop-blur dark:bg-black/60 dark:border-neutral-800">
      <ul className="grid grid-cols-4">
        <li>
          <Link href="/" className="flex items-center justify-center p-3">
            <Home />
          </Link>
        </li>
        <li>
          <Link href="/explore" className="flex items-center justify-center p-3">
            <Search />
          </Link>
        </li>
        <li>
          <Link href="/messages" className="flex items-center justify-center p-3">
            <Mail />
          </Link>
        </li>
        <li>
          <Link href="/profile" className="flex items-center justify-center p-3">
            <User />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

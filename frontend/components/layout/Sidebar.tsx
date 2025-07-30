import Link from "next/link";
import { Home, User, Compass, Settings } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside>
      <nav>
        
        <Link
          href="/"
        >
          Home
        </Link>
        
        <Link
          href="/search"
        >
          Explore
        </Link>
        
        <Link
          href="/messages"
        >
          Messages
        </Link>
        
        <Link 
          href="/profile"
        >
          Profile
        </Link>
      </nav>
    </aside>
  );
}

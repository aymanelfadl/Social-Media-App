import Link from "next/link";
import { Home, User, Compass, Settings } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="w-16 md:w-40 h-screen bg-white shadow-md p-4 fixed">
      {/* Logo */}
      <div className="flex justify-center">
        <Image
          src="/images/logo.png"
          alt="App Logo"
          width={40}
          height={40}
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-6 mt-10">
        <Link
          href="/"
          className="flex items-center justify-center md:justify-start md:px-4 py-2 text-gray-700 border-b-2 border-[#2596be] hover:text-[#2596be] font-semibold space-x-2"
        >
          <Home className="w-5 h-5" />
          <span className="hidden md:inline">Feed</span>
        </Link>

        <Link
          href="/profile"
          className="flex items-center justify-center md:justify-start md:px-4 py-2 text-gray-700 border-b-2 border-[#2596be] hover:text-[#2596be] font-semibold space-x-2"
        >
          <User className="w-5 h-5" />
          <span className="hidden md:inline">Profile</span>
        </Link>

        <Link
          href="/explore"
          className="flex items-center justify-center md:justify-start md:px-4 py-2 text-gray-700 border-b-2 border-[#2596be] hover:text-[#2596be] font-semibold space-x-2"
        >
          <Compass className="w-5 h-5" />
          <span className="hidden md:inline">Explore</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center justify-center md:justify-start md:px-4 py-2 text-gray-700 border-b-2 border-[#2596be] hover:text-[#2596be] font-semibold space-x-2"
        >
          <Settings className="w-5 h-5" />
          <span className="hidden md:inline">Settings</span>
        </Link>
      </nav>
    </aside>
  );
}

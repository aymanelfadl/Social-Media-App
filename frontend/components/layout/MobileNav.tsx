import Link from "next/link";
import { Home, Search, Mail, User } from "lucide-react";
import { useRouter } from "next/router";

export default function MobileNav() {
  const router = useRouter();
  const { pathname } = router;

  const items = [
    { href: "/", label: "Home", icon: Home, isActive: pathname === "/" },
    { href: "/explore", label: "Explore", icon: Search, isActive: pathname.startsWith("/explore") },
    { href: "/messages/page", label: "Messages", icon: Mail, isActive: pathname.startsWith("/messages") },
    { href: "/profile/page", label: "Profile", icon: User, isActive: pathname.startsWith("/profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-neutral-200 bg-white/90 backdrop-blur dark:bg-black/60 dark:border-neutral-800">
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, icon: Icon, isActive }) => (
          <li key={href}>
            <Link
              href={href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center justify-center p-3 ${
                isActive
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-neutral-600 dark:text-neutral-300 hover:text-sky-600"
              }`}
            >
              <Icon size={24} />
            </Link>
          </li>
        ))}
      </ul>
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

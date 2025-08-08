import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Search, MessageSquare, User, LogIn } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/messages/page", label: "Messages", icon: MessageSquare },
  { href: "/profile/page", label: "Profile", icon: User },
  { href: "/auth/login", label: "Log in", icon: LogIn },
];

export default function Sidebar() {
  const router = useRouter();
  return (
    <nav className="sticky top-[4.25rem] space-y-2">
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="h-10 w-10 rounded-2xl bg-sky-500" />
        <span className="text-xl font-bold">Social App</span>
      </div>
      <ul className="space-y-1">
        {links.map((l) => {
          const Icon = l.icon;
          const active = router.pathname === l.href;
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`flex items-center gap-3 rounded-full px-4 py-3 text-[15px] transition-colors ${
                  active
                    ? "bg-neutral-100 dark:bg-neutral-900 font-semibold"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{l.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="px-4 pt-2">
        <Link
          href="/auth/register"
          className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
        >
          Create account
        </Link>
      </div>
    </nav>
  );
}
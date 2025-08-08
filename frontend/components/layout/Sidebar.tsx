import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Home, Search, MessageSquare, User, LogIn, LogOut, SunMedium, Moon } from "lucide-react";
import { logoutUser } from "@/lib/auth";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/features/ui/uiSlice";
import { logout } from "@/features/auth/authSlice";
import type { RootState } from "@/store";

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useSelector((s: RootState) => s.ui.theme);
  const { isAuthenticated: authed } = useSelector((s: RootState) => s.auth);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Search },
    { href: "/messages/page", label: "Messages", icon: MessageSquare },
    { href: "/profile/page", label: "Profile", icon: User },
  ];

  // Auth event listener
  useEffect(() => {
    const handleLogoutEvent = () => {
      dispatch(logout());
    };
    
    window.addEventListener('auth-logout', handleLogoutEvent);
    
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, [dispatch]);

  const handleLogout = () => {
    logoutUser();
    dispatch(logout());
    router.replace("/auth/login");
  };

  return (
    <nav className="sticky top-[4.25rem] space-y-2">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Social App Logo" className="h-10 w-10 rounded-2xl object-cover" />
          <span className="text-xl font-bold">Social App</span>
        </div>
        <button
          aria-label="Toggle theme"
          onClick={() => dispatch(toggleTheme())}
          className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5"
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
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
                    ? "bg-neutral-100 dark:bg-white/10 font-semibold"
                    : "hover:bg-neutral-100 dark:hover:bg-white/5"
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
        {!authed ? (
          <Link
            href="/auth/login"
            className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Log in
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </button>
        )}
      </div>
    </nav>
  );
}
import AppLayout from "@/components/layout/AppLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, type RootState } from "@/store";
import { useEffect, type ReactNode } from "react";
import { isLoggedIn } from "@/lib/auth";
import { setAuthStatus, login, logout } from "@/features/auth/authSlice";
import type { AuthUser } from "@/features/auth/authSlice";

function ThemeSync({ children }: { children: ReactNode }) {
  const theme = useSelector((state: RootState) => state.ui.theme);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);
  return <>{children}</>;
}

function AuthSync({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isLoggedIn();
      dispatch(setAuthStatus(authenticated));
    };
    
    const handleLogin = (e: Event) => {
      const { userData } = (e as CustomEvent<{ userData: AuthUser }>).detail;
      dispatch(login({ user: userData }));
    };
    
    const handleLogout = () => {
      dispatch(logout());
    };
    
    checkAuth();
    
    window.addEventListener('auth-login', handleLogin);
    window.addEventListener('auth-logout', handleLogout);
    document.addEventListener("visibilitychange", checkAuth);
    
    return () => {
      window.removeEventListener('auth-login', handleLogin);
      window.removeEventListener('auth-logout', handleLogout);
      document.removeEventListener("visibilitychange", checkAuth);
    };
  }, [dispatch]);
  
  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps)
{
  return (
    <Provider store={store}>
      <ThemeSync>
        <AuthSync>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </AuthSync>
      </ThemeSync>
    </Provider>
  )
}

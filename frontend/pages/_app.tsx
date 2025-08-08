import AppLayout from "@/components/layout/AppLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider, useSelector } from "react-redux";
import { store, type RootState } from "@/store";
import { useEffect, type ReactNode } from "react";

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

export default function App({ Component, pageProps }: AppProps)
{
  return (
    <Provider store={store}>
      <ThemeSync>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ThemeSync>
    </Provider>
  )
}

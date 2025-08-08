import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { loginUser } from "@/lib/auth";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/authSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    
    try {
      const userProfile = {
        id : crypto.randomUUID(),
        name: email.split('@')[0],
        email: email,
        handle: email.split('@')[0].toLowerCase(),
      };
      
      const token = loginUser(userProfile);
      dispatch(login({ user: { ...userProfile, id: token } }));
      const to = (router.query.from as string) || "/";
      router.replace(to);
    } catch (err: unknown) {
      console.error("Login error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          <h1 className="text-2xl font-bold">Log in</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back! Please enter your credentials.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" />
                Remember me
              </label>
              <a className="text-sm text-sky-600 hover:underline" href="#">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="mt-4 text-sm text-neutral-500">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="text-sky-600 hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
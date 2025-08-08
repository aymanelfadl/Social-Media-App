import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function Login() {
  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          <h1 className="text-2xl font-bold">Log in</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Welcome back! Please enter your credentials.
          </p>

          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" />
                Remember me
              </label>
              <a className="text-sm text-sky-600 hover:underline" href="#">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full">Log in</Button>
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
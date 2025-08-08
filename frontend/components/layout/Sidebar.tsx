import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { setAuthToken } from "@/lib/auth";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Demo register: set a token cookie and redirect home
    setAuthToken(crypto.randomUUID(), 7);
    router.replace("/");
  };

  return (
    <div className="px-4 py-8">
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Join the conversation in seconds.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
              <input
                id="name"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 outline-none"
                placeholder="Your name"
                required
              />
            </div>
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>

          <p className="mt-4 text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-sky-600 hover:underline">
              Log in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
import { useEffect, useState, useCallback } from "react";
import { fetchDemoPosts } from "@/lib/demo";
import PostCard from "@/components/feed/Post";
import type { Post } from "@/features/feed/feedSlice";
import { isLoggedIn } from "@/lib/auth";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const loadTrendingPosts = useCallback(() => {
    setLoading(true);
    
    // Load trending posts with higher number to get more variety
    fetchDemoPosts(10)
      .then(postData => {
        // Sort by metrics to get the "trending" posts
        const trendingPosts = [...postData].sort((a, b) => 
          (b.metrics.likes + b.metrics.views) - (a.metrics.likes + a.metrics.views)
        );
        setPosts(trendingPosts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading trending posts:", error);
        setLoading(false);
      });
  }, []);
  
  useEffect(() => {
    loadTrendingPosts();
    setIsAuthenticated(isLoggedIn());
  }, [loadTrendingPosts]);

  return (
    <div>
      {!isAuthenticated && (
        <div className="border-b border-neutral-200 dark:border-neutral-800 p-4">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Welcome to Social App</h2>
              <p className="text-neutral-600 dark:text-neutral-400">Sign up to see your personalized feed, like posts, and connect with others.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/auth/login" className="inline-flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-transparent px-4 text-center text-sm font-medium hover:bg-neutral-50 dark:hover:bg-white/5">
                Log in
              </Link>
              <Link href="/auth/register" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 text-center">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <div className="sticky top-0 z-10 border-b border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur px-4 py-3">
        <div className="relative">
          <input
            type="search"
            placeholder="Search posts and people"
            className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm outline-none"
            onChange={(e) => {
              const value = e.target.value;
              if (value.length >= 2) {
                console.log("Searching for:", value);
              }
            }}
          />
        </div>
      </div>

      {/* Header with refresh button */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-bold">Explore Trending Posts</h2>
        <button 
          onClick={loadTrendingPosts}
          className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Refresh trending posts"
          disabled={loading}
        >
          <RefreshCw className={`h-5 w-5 text-neutral-600 dark:text-neutral-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <p className="text-neutral-500">Loading trending posts...</p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {posts.length === 0 && (
            <div className="p-8 text-center text-neutral-500">
              No trending posts found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
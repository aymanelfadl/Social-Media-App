import { useEffect, useState, useCallback } from "react";
import { fetchTrendingImages, fetchDemoPosts, fetchDemoUsers } from "@/lib/demo";
import PostCard from "@/components/feed/Post";
import type { Post } from "@/features/feed/feedSlice";
import { isLoggedIn } from "@/lib/auth";
import Link from "next/link";
import { TrendingUp, Users, RefreshCw } from "lucide-react";

export default function Explore() {
  const [images, setImages] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'images' | 'posts' | 'people'>('all');
  
  const trendingTopics = [
    { topic: "Programming", posts: 5243 },
    { topic: "Travel", posts: 3128 },
    { topic: "Photography", posts: 2845 },
    { topic: "Technology", posts: 2156 },
    { topic: "Food", posts: 1879 }
  ];
  
  const loadExploreData = useCallback(() => {
    setLoading(true);
    
    // Load all data in parallel
    Promise.all([
      fetchTrendingImages(4),
      fetchDemoPosts(6),
      fetchDemoUsers(3)
    ])
      .then(([imageData, postData, userData]) => {
        setImages(imageData);
        setPosts(postData);
        setUsers(userData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading explore data:", error);
        setLoading(false);
      });
  }, []);
  
  useEffect(() => {
    loadExploreData();
    setIsAuthenticated(isLoggedIn());
  }, [loadExploreData]);

  return (
    <div>
      {!isAuthenticated && (
        <div className="border-b border-neutral-200 dark:border-neutral-800  p-4">
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
      
      <div className="sticky top-0 z-10 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/95 dark:bg-black/95 backdrop-blur px-4 py-3">
        <div className="relative">
          <input
            type="search"
            placeholder="Search posts and people"
            className="w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-4 py-2 text-sm outline-none"
            onChange={(e) => {
              const value = e.target.value;
              if (value.length >= 2) {
                // Would connect to searchAll API in a real implementation
                console.log("Searching for:", value);
              }
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <p className="text-neutral-500">Loading explore content...</p>
        </div>
      ) : (
        <>
          {/* Header with refresh button */}
          <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-bold">Explore</h2>
            <button 
              onClick={loadExploreData}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Refresh content"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 text-neutral-600 dark:text-neutral-400 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
          
          {/* Simple Filter Tabs */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'images', label: 'Images' },
              { id: 'posts', label: 'Posts' },
              { id: 'people', label: 'People' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-3 whitespace-nowrap text-sm transition-colors ${
                  activeFilter === tab.id 
                    ? 'text-sky-500 border-b-2 border-sky-500' 
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Conditional content based on filter */}
          
          {/* Media Gallery - show on 'all' or 'images' filter */}
          {(activeFilter === 'all' || activeFilter === 'images') && (
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="mb-3 text-lg font-bold">Trending Images</h2>
              <div className="grid grid-cols-2 gap-2">
                {images.map((src, i) => (
                  <div
                    key={i}
                    className="aspect-video overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
                  >
                    <img src={src} alt={`Trending image ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Trending Topics - show on 'all' filter */}
          {activeFilter === 'all' && (
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-sky-500" />
                <h2 className="text-lg font-bold">Trending Topics</h2>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">#{item.topic}</p>
                      <p className="text-xs text-neutral-500">{item.posts.toLocaleString()} posts</p>
                    </div>
                    <button className="text-xs text-sky-500 hover:underline">View</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Who to Follow - show on 'all' or 'people' filter */}
          {(activeFilter === 'all' || activeFilter === 'people') && (
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-bold">Who to Follow</h2>
              </div>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-neutral-300 overflow-hidden">
                        {user.avatarUrl && <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-neutral-500">@{user.handle}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm font-medium rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Popular Posts - show on 'all' or 'posts' filter */}
          {(activeFilter === 'all' || activeFilter === 'posts') && (
            <div className="p-4">
              <h2 className="mb-3 text-lg font-bold">Popular Posts</h2>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
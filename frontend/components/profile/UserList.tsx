import { FollowUser, follow, unfollow } from "@/features/profile/profileSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { shouldUnoptimize } from "@/lib/images";

export default function UserList({ users, title }: { users: FollowUser[]; title: string }) {
  const dispatch = useDispatch();

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white">
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 py-3">
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {users.map((u) => (
          <li key={u.id} className="flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-neutral-300 overflow-hidden">
                {u.avatarUrl && <Image src={u.avatarUrl} alt={u.name} width={40} height={40} className="h-10 w-10 object-cover" unoptimized={shouldUnoptimize(u.avatarUrl)} />}
              </div>
              <div>
                <p className="font-medium leading-tight">{u.name}</p>
                <p className="text-sm text-neutral-500">@{u.handle}</p>
              </div>
            </div>
            <button
              onClick={() => (u.isFollowing ? dispatch(unfollow({ id: u.id })) : dispatch(follow({ id: u.id })))}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                u.isFollowing ? "border hover:bg-neutral-50 dark:hover:bg-white/5" : "bg-sky-500 text-white hover:bg-sky-600"
              }`}
            >
              {u.isFollowing ? "Following" : "Follow"}
            </button>
          </li>
        ))}
        {users.length === 0 && (
          <li className="p-4 text-sm text-neutral-500">No users yet.</li>
        )}
      </ul>
    </div>
  );
}
import { useRef } from "react";
import { fileToDataURL } from "@/lib/persist";
import { useDispatch, useSelector } from "react-redux";
import { updateMe } from "@/features/profile/profileSlice";
import type { RootState } from "@/store";

export default function ProfileHeader({ onEditClick }: { onEditClick: () => void }) {
  const dispatch = useDispatch();
  const me = useSelector((s: RootState) => s.profile.me);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const onPickBanner = async (file: File) => {
    const dataUrl = await fileToDataURL(file);
    dispatch(updateMe({ bannerUrl: dataUrl }));
  };

  const onPickAvatar = async (file: File) => {
    const dataUrl = await fileToDataURL(file);
    dispatch(updateMe({ avatarUrl: dataUrl }));
  };

  return (
    <div>
      <div className="relative h-48 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
        {me.bannerUrl && (
          <img src={me.bannerUrl} alt="banner" className="h-full w-full object-cover" />
        )}
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            onClick={() => bannerInputRef.current?.click()}
            className="rounded-full border px-3 py-1.5 text-sm text-white transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
          >
            Change banner
          </button>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPickBanner(f);
            }}
          />
        </div>
      </div>

      <div className="px-4">
        <div className="-mt-12 flex items-end justify-between">
          <div className="flex items-end gap-3">
            <div className="relative h-24 w-24 rounded-full border-4 border-[var(--color-background)] bg-neutral-300 overflow-hidden">
              {me.avatarUrl && (
                <img src={me.avatarUrl} alt={me.name} className="h-24 w-24 object-cover" />
              )}
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-1 right-1 rounded-full border bg-[var(--card-bg)] px-2 py-0.5 text-xs transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
                title="Change avatar"
              >
                Edit
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onPickAvatar(f);
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">{me.name}</h1>
              <p className="text-neutral-500">@{me.handle}</p>
            </div>
          </div>

          <button
            onClick={onEditClick}
            className="rounded-full border px-4 py-2 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
          >
            Edit profile
          </button>
        </div>

        {me.bio && <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">{me.bio}</p>}
      </div>
    </div>
  );
}

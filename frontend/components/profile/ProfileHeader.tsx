import { useState, useRef } from "react";
import { fileToDataURL, loadProfile, saveProfile } from "@/lib/persist";

export default function ProfileHeader({ onEditClick }: { onEditClick: () => void }) {
  const [profile, setProfile] = useState(() =>
    loadProfile() ?? {
      name: "You",
      handle: "you",
      bio: "Bio goes here. Building web apps with Next.js.",
      avatarUrl: "",
      bannerUrl: "",
    }
  );

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const save = (next: Partial<typeof profile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...next };
      saveProfile(updated);
      return updated;
    });
  };

  const onPickBanner = async (file: File) => {
    const dataUrl = await fileToDataURL(file);
    save({ bannerUrl: dataUrl });
  };

  const onPickAvatar = async (file: File) => {
    const dataUrl = await fileToDataURL(file);
    save({ avatarUrl: dataUrl });
  };

  return (
    <div>
      <div className="relative h-48 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
        {profile.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.bannerUrl} alt="banner" className="h-full w-full object-cover" />
        )}
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            onClick={() => bannerInputRef.current?.click()}
            className="rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
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
              {profile.avatarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt={profile.name} className="h-24 w-24 object-cover" />
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
              <h1 className="text-xl font-bold leading-tight">{profile.name}</h1>
              <p className="text-neutral-500">@{profile.handle}</p>
            </div>
          </div>

          <button
            onClick={onEditClick}
            className="rounded-full border px-4 py-2 text-sm transition-colors hover:bg-neutral-50 dark:hover:bg-white/5"
          >
            Edit profile
          </button>
        </div>

        {profile.bio && <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">{profile.bio}</p>}
      </div>
    </div>
  );
}
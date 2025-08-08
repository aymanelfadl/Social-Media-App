import { useState } from "react";
import Modal from "@/components/common/Modal";
import { useDispatch, useSelector } from "react-redux";
import { updateMe } from "@/features/profile/profileSlice";
import type { RootState } from "@/store";

export default function EditProfileModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const me = useSelector((s: RootState) => s.profile.me);
  const [name, setName] = useState(me.name);
  const [bio, setBio] = useState(me.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(me.avatarUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState(me.bannerUrl ?? "");
  const dispatch = useDispatch();

  const onSave = () => {
    dispatch(
      updateMe({
        name: name.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
        bannerUrl: bannerUrl.trim(),
      })
    );
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit profile">
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 transition"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"
          />
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
            Avatar URL
          </label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 transition"
          />
          {avatarUrl && (
            <div className="mt-3 h-16 w-16 overflow-hidden rounded-full border border-neutral-300 dark:border-neutral-700 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-16 w-16 object-cover"
                onError={() => setAvatarUrl("")}
              />
            </div>
          )}
        </div>

        {/* Banner URL */}
        <div>
          <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
            Banner URL
          </label>
          <input
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500 transition"
          />
          {bannerUrl && (
            <div className="mt-3 h-24 overflow-hidden rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bannerUrl}
                alt="banner"
                className="w-full h-24 object-cover"
                onError={() => setBannerUrl("")}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="rounded-full border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

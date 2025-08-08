export type ProfileData = {
  name: string;
  handle: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
};

const PROFILE_KEY = "profile.v1";
const FOLLOW_KEY = "whoToFollow.v1";

export function loadProfile(): ProfileData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as ProfileData) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: ProfileData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {}
}

export type WhoToFollow = {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  isFollowing?: boolean;
};

export function loadWhoToFollow(): WhoToFollow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FOLLOW_KEY);
    return raw ? (JSON.parse(raw) as WhoToFollow[]) : [];
  } catch {
    return [];
  }
}

export function saveWhoToFollow(list: WhoToFollow[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FOLLOW_KEY, JSON.stringify(list));
  } catch {}
}

export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}
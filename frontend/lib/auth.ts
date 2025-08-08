export function setAuthToken(token: string, days = 7) {
  const maxAge = days * 86400;
  document.cookie = `auth_token=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearAuthToken() {
  document.cookie = "auth_token=; Max-Age=0; Path=/; SameSite=Lax";
}

export function isLoggedIn() {
  return !!getAuthToken();
}

export function getUserProfile() {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const userData = localStorage.getItem(`user_${token}`);
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error("Error loading user profile:", e);
    return null;
  }
}

interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  bio?: string;
  followingCount?: number;
  followersCount?: number;
  [key: string]: unknown;
}

// Function to save or update user profile data
export function saveUserProfile(userData: UserProfile) {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    localStorage.setItem(`user_${token}`, JSON.stringify(userData));
    
    // Dispatch an auth event to update Redux
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-profile-update', { 
        detail: { userData } 
      }));
    }
    
    return true;
  } catch (e) {
    console.error("Error saving user profile:", e);
    return false;
  }
}

// Function to login a user
export function loginUser(userData: UserProfile) {
  // Generate a token if not provided
  const token = userData.id || crypto.randomUUID();
  
  // Set the auth token
  setAuthToken(token, 7);
  
  // Save the user profile
  userData.id = token;
  saveUserProfile(userData);
  
  // Dispatch an auth event for any listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth-login', { 
      detail: { userData } 
    }));
  }
  
  return token;
}

// Function to completely log out and clear user data
export function logoutUser() {
  // Clear the auth token from cookies
  clearAuthToken();
  
  // Clear user data from localStorage
  try {
    const keys = Object.keys(localStorage);
    const userKeys = keys.filter(key => key.startsWith('user_'));
    userKeys.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error("Error clearing user data:", e);
  }
  
  // Update Redux state (must be called from component)
  if (typeof window !== 'undefined') {
    // Dispatch an auth event for any listeners
    window.dispatchEvent(new CustomEvent('auth-logout'));
  }
}
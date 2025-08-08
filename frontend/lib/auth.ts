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

// Function to save or update user profile data
export function saveUserProfile(userData: any) {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    localStorage.setItem(`user_${token}`, JSON.stringify(userData));
    return true;
  } catch (e) {
    console.error("Error saving user profile:", e);
    return false;
  }
}

// Function to completely log out and clear user data
export function logoutUser() {
  // Clear the auth token from cookies
  clearAuthToken();
  
  // You could also clear any user-specific data from localStorage here
  // For example, if you want to clear all user data:
  // localStorage.clear();
  
  // Or, if you want to be more selective:
  try {
    const keys = Object.keys(localStorage);
    const userKeys = keys.filter(key => key.startsWith('user_'));
    userKeys.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error("Error clearing user data:", e);
  }
}
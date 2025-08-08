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
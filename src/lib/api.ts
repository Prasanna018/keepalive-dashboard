export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// --- Cookie Helpers ---
export function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; Max-Age=-99999999;path=/;`;
}
// ----------------------

function getTokens() {
  return {
    access: getCookie("keepalive_token"),
    refresh: getCookie("keepalive_refresh_token"),
  };
}

function setTokens(access: string, refresh: string) {
  setCookie("keepalive_token", access, 7); // 7 days fallback for access (logic handles 5m)
  setCookie("keepalive_refresh_token", refresh, 7);
}

function clearTokens() {
  removeCookie("keepalive_token");
  removeCookie("keepalive_refresh_token");
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

async function refreshToken() {
  const { refresh } = getTokens();
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!res.ok) {
    clearTokens();
    window.location.href = "/auth";
    throw new Error("Session expired");
  }

  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  return data.access_token;
}

// SWR fetcher — used for all GET requests via useSWR
export const fetcher = async (url: string) => {
  const { access } = getTokens();
  
  const res = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
  });

  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newAccessToken = await refreshToken();
        isRefreshing = false;
        onTokenRefreshed(newAccessToken);
      } catch (err) {
        isRefreshing = false;
        throw err;
      }
    }

    return new Promise<any>((resolve) => {
      refreshSubscribers.push((token: string) => {
        resolve(
          fetch(`${API_URL}${url}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((r) => r.json())
        );
      });
    });
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw error;
  }

  return res.json();
};

// Mutation helper — used for POST, PUT, PATCH, DELETE
export const apiFetch = async (
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
) => {
  const { access } = getTokens();

  let res = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401) {
    try {
      const newAccessToken = await refreshToken();
      res = await fetch(`${API_URL}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
    } catch (err) {
      clearTokens();
      window.location.href = "/auth";
      throw err;
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw error;
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

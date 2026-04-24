export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("keepalive_token");
}

// SWR fetcher — used for all GET requests via useSWR
export const fetcher = async (url: string) => {
  const res = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("keepalive_token");
    window.location.href = "/auth";
    return;
  }

  if (!res.ok) {
    const text = await res.text();
    let detail = "Unknown error";
    try {
      const json = JSON.parse(text);
      detail = json.detail || detail;
    } catch {
      if (text.includes("suspended")) detail = "BACKEND_SUSPENDED";
      else detail = text || detail;
    }
    throw { detail, status: res.status };
  }

  return res.json();
};

// Mutation helper — used for POST, PUT, PATCH, DELETE
export const apiFetch = async (
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
) => {
  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401) {
    localStorage.removeItem("keepalive_token");
    window.location.href = "/auth";
    return;
  }

  if (!res.ok) {
    const text = await res.text();
    let detail = "Unknown error";
    try {
      const json = JSON.parse(text);
      detail = json.detail || detail;
    } catch {
      if (text.includes("suspended")) detail = "BACKEND_SUSPENDED";
      else detail = text || detail;
    }
    throw { detail, status: res.status };
  }

  // DELETE may return no content
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

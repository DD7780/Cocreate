export const api = async (
  path: string,
  token?: string,
  options: RequestInit = {},
) => {
  const res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    }),
    body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Request failed");
  return body;
};

// Display metadata only; the server remains the authorization boundary.
export const tokenRole = (token: string) => {
  try {
    return JSON.parse(
      atob(token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/")),
    ).role as string | undefined;
  } catch {
    return undefined;
  }
};

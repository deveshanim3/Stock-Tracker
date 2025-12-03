const BASE_URL = "http://localhost:3000";

export const authFetch = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    console.log("Access token expired. Refreshing...");

    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error("Session expired. Please login again.");
    }

    res = await fetch(url, {
      ...options,
      credentials: "include",
    });
  }

  return res;
};

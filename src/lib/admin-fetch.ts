export const dynamic = "force-dynamic";

export async function adminFetch(input: RequestInfo, init?: RequestInit) {
  return fetch(input, {
    ...init,
    cache: "no-store",
    headers: {
      ...init?.headers,
      "Cache-Control": "no-cache",
    },
  });
}

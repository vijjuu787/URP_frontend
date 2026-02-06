/**
 * Utility function to make authenticated API calls
 * Automatically includes Bearer token from localStorage if available
 */
export async function apiCall<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});

  // Add Bearer token if it exists in localStorage
  const token = localStorage.getItem("authToken");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ensure Content-Type is set
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  console.log(`[API] Making ${options.method || "GET"} request to:`, url);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log(`[API] Response status:`, response.status, response.statusText);

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      // Try to parse as JSON
      if (contentType?.includes("application/json")) {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
      } else {
        // If not JSON, read as text
        const text = await response.text();
        console.error("[API] Non-JSON error response:", text.substring(0, 200));
        errorMessage = text.substring(0, 200) || errorMessage;
      }
    } catch (e) {
      console.error("[API] Failed to parse error response:", e);
    }

    throw new Error(errorMessage);
  }

  const result = await response.json();
  console.log(`[API] Response data:`, result);
  return result;
}

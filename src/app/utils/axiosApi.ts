import axios, { AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../../config/api";

/**
 * Axios instance configured for authenticated requests with HTTP-only cookies
 * - withCredentials: true enables automatic cookie handling
 * - Cookies are set by the backend and sent automatically on subsequent requests
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enable HTTP-only cookie support
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Generic API call utility function using axios
 * Automatically handles HTTP-only cookies via axios instance configuration
 *
 * @template T - The expected response type
 * @param {string} endpoint - The API endpoint (e.g., '/api/endpoint')
 * @param {AxiosRequestConfig} config - Axios request configuration
 * @returns {Promise<T>} The parsed response data
 */
export async function apiCall<T>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<T> {
  try {
    const method = config.method || "GET";
    console.log(`[API] Making ${method} request to:`, endpoint);

    const response = await apiClient(endpoint, config);

    console.log(`[API] Response status:`, response.status);
    console.log(`[API] Response data:`, response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Unknown error";

      console.error(
        `[API] Error ${error.response?.status}:`,
        errorMessage,
      );

      throw new Error(errorMessage);
    }

    console.error("[API] Unexpected error:", error);
    throw error;
  }
}

/**
 * Legacy fetch-based API utility (deprecated - use apiCall or apiClient instead)
 * Kept for backwards compatibility with existing code
 *
 * @deprecated Use apiCall or apiClient instead
 */
export async function apiFetchCall<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});

  // Ensure Content-Type is set
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  console.log(`[API] Making ${options.method || "GET"} request to:`, url);

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Include cookies in cross-origin requests
  });

  console.log(`[API] Response status:`, response.status, response.statusText);

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      if (contentType?.includes("application/json")) {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
      } else {
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

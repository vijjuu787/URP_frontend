import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL } from "../../config/api";

/**
 * Axios instance configured for authenticated requests with HTTP-only cookies
 * - withCredentials: true enables automatic cookie handling
 * - Cookies are set by the backend and sent automatically on subsequent requests
 * - No manual token management needed
 */
const apiClient = axios.create({
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
 * Supports both the new endpoint format (e.g., '/api/endpoint')
 * and legacy format (e.g., 'https://urp-backend-1.onrender.com/api/endpoint')
 *
 * @template T - The expected response type
 * @param {string} url - The API endpoint (can be full URL or path)
 * @param {any} options - Request configuration (supports fetch-style or axios-style)
 * @returns {Promise<T>} The parsed response data
 */
export async function apiCall<T>(
  url: string,
  options: any = {},
): Promise<T> {
  try {
    const method = (options.method || "GET").toUpperCase();

    // Convert fetch-style options to axios format if needed
    let axiosConfig: AxiosRequestConfig = {
      method: method as any,
      ...options,
    };

    // Convert fetch-style body to axios data
    if (options.body && typeof options.body === "string") {
      axiosConfig.data = JSON.parse(options.body);
      delete (axiosConfig as any).body;
    }

    // Remove BaseURL from URL if it's included to avoid duplication
    let endpoint = url;
    if (endpoint.startsWith("http")) {
      // If it's a full URL, extract just the path
      try {
        const urlObj = new URL(endpoint);
        endpoint = urlObj.pathname + urlObj.search;
      } catch (e) {
        // If URL parsing fails, use as-is
      }
    }

    console.log(`[API] Making ${method} request to:`, endpoint);

    const response = await apiClient(endpoint, axiosConfig);

    console.log(`[API] Response status:`, response.status);
    console.log(`[API] Response data:`, response.data);

    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unknown error";

      console.error(
        `[API] Error ${axiosError.response?.status}:`,
        errorMessage,
      );

      throw new Error(errorMessage);
    }

    console.error("[API] Unexpected error:", error);
    throw error;
  }
}

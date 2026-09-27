import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { getStoredAccessToken, setStoredAccessToken, clearStoredAuth } from "../utils/storage";
import { API_ENDPOINTS } from "./endpoints";
import { ApiResponse, ValidationErrorItem } from "./types";

const RAW_API_URL = process.env.EXPO_PUBLIC_BACKEND_API || "http://192.168.31.191:5000/api/v1";
export const BASE_API_URL = RAW_API_URL.replace(/\/+$/, "");

export const apiClient = axios.create({
  baseURL: BASE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Flag and queue to handle concurrent requests during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/* ──────────────── Request Interceptor ──────────────── */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getStoredAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Continue without token if storage access fails
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ──────────────── Response Interceptor ──────────────── */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Avoid infinite loop on auth endpoints
    const isAuthRequest =
      originalRequest?.url?.includes(API_ENDPOINTS.AUTH.LOGIN) ||
      originalRequest?.url?.includes(API_ENDPOINTS.AUTH.REGISTER) ||
      originalRequest?.url?.includes(API_ENDPOINTS.AUTH.REFRESH);

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${BASE_API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          {},
          { withCredentials: true, timeout: 10000 }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (newAccessToken) {
          await setStoredAccessToken(newAccessToken);
          processQueue(null, newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        await clearStoredAuth();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Extracts a user-facing error message from an API or Axios error.
 */
export function getApiErrorMessage(error: unknown, fallbackMessage = "An error occurred. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    const responseData = axiosError.response?.data;

    // Check for validation errors array from backend Zod error handler
    if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
      const firstIssue = responseData.errors[0] as ValidationErrorItem;
      if (firstIssue && typeof firstIssue.message === "string") {
        return firstIssue.message;
      }
    }

    // Check backend message
    if (responseData?.message) {
      return responseData.message;
    }

    // Network / timeout errors
    if (axiosError.code === "ECONNABORTED" || axiosError.message.includes("timeout")) {
      return "Network timeout. Please check your connection and try again.";
    }

    if (axiosError.message === "Network Error") {
      return "Unable to connect to the server. Please check your internet or server status.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

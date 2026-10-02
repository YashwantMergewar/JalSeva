import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import {
  ApiResponse,
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
  User,
} from "./types";

/**
 * Register a new citizen account
 */
export async function registerCitizen(
  payload: RegisterPayload
): Promise<ApiResponse<User>> {
  const response = await apiClient.post<ApiResponse<User>>(
    API_ENDPOINTS.AUTH.REGISTER,
    payload
  );
  return response.data;
}

/**
 * Authenticate citizen via email/phone and password
 */
export async function loginCitizen(
  payload: LoginPayload
): Promise<ApiResponse<AuthResponseData>> {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>(
    API_ENDPOINTS.AUTH.LOGIN,
    payload
  );
  return response.data;
}

/**
 * Refresh access token using httpOnly cookie or stored session
 */
export async function refreshAccessToken(): Promise<
  ApiResponse<{ accessToken: string }>
> {
  const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
    API_ENDPOINTS.AUTH.REFRESH
  );
  return response.data;
}

/**
 * Fetch profile of currently authenticated user
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const response = await apiClient.get<ApiResponse<User>>(
    API_ENDPOINTS.AUTH.ME
  );
  return response.data;
}

/**
 * Terminate current user session
 */
export async function logoutUser(): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.LOGOUT
  );
  return response.data;
}

/**
 * Terminate all sessions for the user
 */
export async function logoutAllSessions(): Promise<ApiResponse<null>> {
  const response = await apiClient.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.LOGOUT_ALL
  );
  return response.data;
}

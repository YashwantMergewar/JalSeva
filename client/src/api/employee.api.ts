import { apiClient, getApiErrorMessage } from "./client";
import { ApiResponse } from "./types";

// ─────────── Types ───────────
export interface Role {
  id: string;
  name: string;
  description?: string | null;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
}

export interface EmployeePublic {
  id: string;
  employeeId: string | null;
  fullname: string;
  email: string;
  mobile_no: string;
  userType: "EMPLOYEE";
  roleId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role?: Role | null;
  employeeDepartment?: Array<{ department: Department }>;
  /** Pending (unused, non-revoked) activation token info */
  activationTokens?: Array<{ expiresAt: string; createdAt: string }>;
}

export interface CreateEmployeePayload {
  fullname: string;
  email: string;
  mobile_no: string;
  roleId: string;
  departmentId: string;
  officeName?: string;
}

export interface CreateEmployeeResponseData {
  employee: EmployeePublic;
  department: Department;
  role: Role;
  emailSent: boolean;
}

export interface ActivateAccountPayload {
  token: string;
  password: string;
}

export interface ActivateAccountResponseData {
  employeeId: string | null;
  fullname: string;
  email: string;
  role: Role | null;
  department: Department | null;
}

export interface VerifyTokenResponseData {
  employeeId: string | null;
  fullname: string;
  role: Role | null;
  department: Department | null;
  expiresAt: string;
}

// ─────────── API functions ───────────
const BASE = "/employees";

export async function apiCreateEmployee(
  payload: CreateEmployeePayload
): Promise<ApiResponse<CreateEmployeeResponseData>> {
  const res = await apiClient.post<ApiResponse<CreateEmployeeResponseData>>(
    BASE,
    payload
  );
  return res.data;
}

export async function apiListEmployees(): Promise<
  ApiResponse<EmployeePublic[]>
> {
  const res = await apiClient.get<ApiResponse<EmployeePublic[]>>(BASE);
  return res.data;
}

export async function apiGetEmployee(
  id: string
): Promise<ApiResponse<EmployeePublic>> {
  const res = await apiClient.get<ApiResponse<EmployeePublic>>(`${BASE}/${id}`);
  return res.data;
}

export async function apiGetRoles(): Promise<ApiResponse<Role[]>> {
  const res = await apiClient.get<ApiResponse<Role[]>>(`${BASE}/meta/roles`);
  return res.data;
}

export async function apiGetDepartments(): Promise<ApiResponse<Department[]>> {
  const res = await apiClient.get<ApiResponse<Department[]>>(
    `${BASE}/meta/departments`
  );
  return res.data;
}

export async function apiResendInvitation(
  employeeId: string
): Promise<ApiResponse<{ emailSent: boolean }>> {
  const res = await apiClient.post<ApiResponse<{ emailSent: boolean }>>(
    `${BASE}/${employeeId}/resend-invitation`,
    {}
  );
  return res.data;
}

/**
 * Verify an activation token — returns employee info for pre-filling the screen.
 * Public endpoint; does not require auth.
 */
export async function apiVerifyActivationToken(
  token: string
): Promise<ApiResponse<VerifyTokenResponseData>> {
  const res = await apiClient.get<ApiResponse<VerifyTokenResponseData>>(
    `${BASE}/verify-token`,
    { params: { token } }
  );
  return res.data;
}

/**
 * Activate an employee account with a password.
 * Public endpoint; does not require auth.
 */
export async function apiActivateAccount(
  payload: ActivateAccountPayload
): Promise<ApiResponse<ActivateAccountResponseData>> {
  const res = await apiClient.post<ApiResponse<ActivateAccountResponseData>>(
    `${BASE}/activate`,
    payload
  );
  return res.data;
}

export { getApiErrorMessage };

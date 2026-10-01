export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown;
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  mobile_no: string;
  userType: "CITIZEN" | "EMPLOYEE";
  roleId: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  accessToken: string;
  user: User;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  fullname: string;
  email: string;
  mobile_no: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationErrorItem {
  path: (string | number)[];
  message: string;
}

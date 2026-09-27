export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/users/register",
    LOGIN: "/users/login",
    REFRESH: "/users/refresh",
    LOGOUT: "/users/logout",
    LOGOUT_ALL: "/users/logout-all",
    ME: "/users/me",
  },
} as const;

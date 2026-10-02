/**
 * Backward compatibility layer for auth utilities.
 * All core operations now route through modular src/api, src/validation, and src/utils/storage.
 */
import {
  AuthResponseData,
  LoginPayload,
  RegisterPayload,
  User,
  getApiErrorMessage,
  loginCitizen as apiLoginCitizen,
  registerCitizen as apiRegisterCitizen,
} from "../api";
import {
  LoginFormValues,
  RegistrationFormValues,
  citizenLoginSchema,
  citizenRegistrationSchema,
} from "../validation";
import {
  getStoredAccessToken,
  getStoredUser,
  setStoredAccessToken,
  setStoredUser,
  clearStoredAuth,
} from "../utils/storage";

export const loginSchema = citizenLoginSchema;
export const registrationSchema = citizenRegistrationSchema;

export type LoginValues = LoginFormValues;
export type RegistrationValues = RegistrationFormValues;

export async function registerCitizen(values: RegistrationValues): Promise<User> {
  try {
    const res = await apiRegisterCitizen(values);
    if (!res.data) {
      throw new Error(res.message || "Registration failed");
    }
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Could not create your account."));
  }
}

export async function loginCitizen(values: LoginValues): Promise<AuthResponseData> {
  try {
    const res = await apiLoginCitizen(values);
    if (!res.data) {
      throw new Error(res.message || "Login failed");
    }

    // Persist securely to SecureStore
    await Promise.all([
      setStoredAccessToken(res.data.accessToken),
      setStoredUser(res.data.user),
    ]);

    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to sign in. Please try again."));
  }
}

export {
  getStoredAccessToken,
  getStoredUser,
  setStoredAccessToken,
  setStoredUser,
  clearStoredAuth,
};

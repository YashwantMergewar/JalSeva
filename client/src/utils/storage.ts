import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "../constants/storage.constants";

// In-memory fallback strictly for web / test environments without SecureStore keychain support
// NEVER uses localStorage, honoring security requirements
const memoryStore = new Map<string, string>();

async function isSecureStoreAvailable(): Promise<boolean> {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Persists an item using expo-secure-store.
 * Falls back to in-memory store if native keychain is unsupported.
 * Strictly avoids localStorage.
 */
export async function setSecureItem(key: string, value: string): Promise<void> {
  try {
    const available = await isSecureStoreAvailable();
    if (available) {
      await SecureStore.setItemAsync(key, value);
    } else {
      memoryStore.set(key, value);
    }
  } catch (error) {
    // If native keychain throws, keep in memory to prevent app crash
    memoryStore.set(key, value);
  }
}

/**
 * Retrieves an item from expo-secure-store.
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    const available = await isSecureStoreAvailable();
    if (available) {
      return await SecureStore.getItemAsync(key);
    }
    return memoryStore.get(key) ?? null;
  } catch (error) {
    return memoryStore.get(key) ?? null;
  }
}

/**
 * Deletes an item from expo-secure-store.
 */
export async function deleteSecureItem(key: string): Promise<void> {
  try {
    const available = await isSecureStoreAvailable();
    if (available) {
      await SecureStore.deleteItemAsync(key);
    }
    memoryStore.delete(key);
  } catch (error) {
    memoryStore.delete(key);
  }
}

/* ──────────────── Auth-Specific Storage Helpers ──────────────── */

export async function setStoredAccessToken(token: string): Promise<void> {
  await setSecureItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export async function getStoredAccessToken(): Promise<string | null> {
  return await getSecureItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export async function removeStoredAccessToken(): Promise<void> {
  await deleteSecureItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export async function setStoredUser<T = unknown>(user: T): Promise<void> {
  await setSecureItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export async function getStoredUser<T = unknown>(): Promise<T | null> {
  const data = await getSecureItem(STORAGE_KEYS.USER);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export async function removeStoredUser(): Promise<void> {
  await deleteSecureItem(STORAGE_KEYS.USER);
}

export async function clearStoredAuth(): Promise<void> {
  await Promise.all([
    removeStoredAccessToken(),
    removeStoredUser(),
  ]);
}

import { useState, useEffect, Dispatch, SetStateAction } from "react";
export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });
  useEffect(() => {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue !== null) {
      setValue(JSON.parse(storedValue));
    }
  }, [key]);
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function set<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function get<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
export function deleteLocal(key: string): void {
  window.localStorage.removeItem(key);
}

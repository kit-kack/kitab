import { atom, WritableAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Key = Parameters<(typeof storage)["getItem"]>[0];

export function useStorageAtom<T>(key: Key, fallback: T) {
  return atomWithStorage(
    key,
    fallback,
    {
      async getItem(key, initialValue) {
        return await storage.getItem<T>(key as Key, {
          fallback: initialValue,
        });
      },
      async setItem(key, newValue) {
        storage.setItem(key as Key, newValue);
      },
      async removeItem(key) {
        storage.removeItem(key as Key);
      },
    },
    {
      getOnInit: true,
    }
  );
}

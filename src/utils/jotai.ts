import { atomWithStorage } from "jotai/utils";

type Key = Parameters<(typeof storage)["getItem"]>[0];

export function useStorageAtom<T>(key: Key, fallback: T) {
  const isArray = Array.isArray(fallback);
  return atomWithStorage(
    key,
    fallback,
    {
      // @ts-ignore
      async getItem(key, initialValue) {
        const value = await storage.getItem<T>(key as Key, {
          fallback: initialValue,
        });
        if (!isArray) {
          return value;
        }

        // 需要兼容格式化
        // 需要兼容格式化
        let result = value as any[];
        if (!Array.isArray(value)) {
          result = value ? Object.values(value) : [];
        }

        // 遍历result
        for (const group of result) {
          const children = group.children;
          if (children && !Array.isArray(children)) {
            group.children = children ? Object.values(children) : [];
          }
        }
        console.log("storage ", key, result);

        return result;
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

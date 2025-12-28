import { CURRENT_SCENE_ATOM, GIT_INFO_ATOM } from "@/entrypoints/newtab/store";
import { createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { syncConfFile } from "./git-repo-action";

export const store = createStore();

type Key = Parameters<(typeof storage)["getItem"]>[0];

export function useStorageAtom<T>(storageKey: Key, fallback: T) {
  const isArray = Array.isArray(fallback);
  return atomWithStorage(
    storageKey,
    fallback,
    {
      // @ts-ignore
      async getItem(key, initialValue) {
        let realKey = key;
        if (key === "local:website_bookmark_list") {
          const scene = await store.get(CURRENT_SCENE_ATOM);
          realKey = key + "_" + scene;
        }

        const value = await storage.getItem<T>(realKey as Key, {
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
        let realKey = key;
        if (key === "local:website_bookmark_list") {
          const scene = await store.get(CURRENT_SCENE_ATOM);
          realKey = key + "_" + scene;
        }
        storage.setItem(realKey as Key, newValue);
        if (!realKey.endsWith("_temp")) {
          // 去同步至git仓库
          const gitInfo = await store.get(GIT_INFO_ATOM);
          if (gitInfo && gitInfo.token) {
            syncConfFile(
              gitInfo,
              realKey.substring("local:".length),
              JSON.stringify(newValue)
            );
          }
        }
      },
      async removeItem(key) {
        let realKey = key;
        if (key === "local:website_bookmark_list") {
          const scene = await store.get(CURRENT_SCENE_ATOM);
          realKey = key + "_" + scene;
        }
        storage.removeItem(realKey as Key);
      },
    },
    {
      getOnInit: true,
    }
  );
}

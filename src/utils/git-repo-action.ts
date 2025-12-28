import { ComboboxItem } from "@mantine/core";
import { store } from "./jotai";
import {
  GIT_FILE_SHA_ATOM,
  GIT_INFO_ATOM,
  WEBSITE_BOOKMARK_LIST_ATOM,
} from "@/entrypoints/newtab/store";
import { BACKUP_KEYS } from "./backup";
import { notifications } from "@mantine/notifications";

export const GIT_APIS = {
  Github: "https://api.github.com",
  Gitee: "https://gitee.com/api/v5",
} as const;

export interface GitRepoStorage {
  api: keyof typeof GIT_APIS;
  token: string;
  user: string;
  repo: string;
  branch: string;
  avatar: string;
}

function header(storage: GitRepoStorage) {
  const options: RequestInit = {
    headers: {
      Authorization: `Bearer ${storage.token}`,
      "Content-Type": "application/json",
    },
  };
  return options;
}

/**
 * 查询所有git仓库
 */
export function listGitRepos(
  storage: GitRepoStorage
): Promise<
  (Record<"name" | "full_name" | "default_branch", string> & ComboboxItem)[]
> {
  if (!storage.token || !storage.api) {
    return Promise.resolve([]);
  }
  return fetch(`${GIT_APIS[storage.api]}/user/repos`, header(storage))
    .then((res) => res.json())
    .then((res) =>
      res.map((repo: any) => ({ ...repo, value: repo.name, label: repo.name }))
    );
}

/**
 * 查询用户信息
 */
export function queryUserInfo(
  storage: GitRepoStorage
): Promise<Record<"login" | "avatar_url", string>> {
  if (!storage.token || !storage.api) {
    return Promise.resolve({ login: "", avatar_url: "" });
  }
  return fetch(`${GIT_APIS[storage.api]}/user`, header(storage)).then((res) =>
    res.json()
  );
}

function base64Encode(value: string) {
  const bytes = new TextEncoder().encode(value);
  return window.btoa(String.fromCodePoint(...bytes));
}

function base64Decode(value: string) {
  const binStr = window.atob(value);
  const bytes = Uint8Array.from(binStr, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isBackupKeyPrefix(key: string) {
  return BACKUP_KEYS.some((prefix) => key.startsWith(prefix));
}

export async function syncConfFile(
  storage: GitRepoStorage,
  key: string,
  value: string
) {
  if (!isBackupKeyPrefix(key)) return;
  // 先上传文件
  const api = GIT_APIS[storage.api];
  const allSha = await store.get(GIT_FILE_SHA_ATOM);
  const sha = allSha[key];
  const filename = `kitab/${key}`;
  const url = `${api}/repos/${storage.user}/${storage.repo}/contents/${filename}`;
  let res;
  if (sha !== void 0) {
    // update action
    res = await fetch(url, {
      method: "PUT",
      headers: header(storage).headers,
      body: JSON.stringify({
        message:
          "update new kitab conf: " +
          key +
          " at " +
          new Date().toLocaleTimeString(),
        content: base64Encode(value),
        sha: sha,
      }),
    });
  } else {
    // create action
    res = await fetch(url, {
      method: storage.api === "Github" ? "PUT" : "POST",
      headers: header(storage).headers,
      body: JSON.stringify({
        message:
          "create new kitab conf: " +
          key +
          " at " +
          new Date().toLocaleTimeString(),
        content: base64Encode(value),
      }),
    });
  }

  // update sha
  const data = await res.json();
  const newSha = data.content.sha;
  store.set(GIT_FILE_SHA_ATOM, { ...allSha, [key]: newSha });
}

async function findLatestRootSha(
  gitInfo: GitRepoStorage
): Promise<string | undefined> {
  const api = GIT_APIS[gitInfo.api];
  // 重新从根节点查询一遍
  const url = `${api}/repos/${gitInfo.user}/${gitInfo.repo}/git/trees/${
    gitInfo.branch
  }?now=${Date.now()}`;
  const res = await fetch(url, header(gitInfo));
  const tempTreeData = (await res.json())?.tree || [];
  // 去查找 名称为kitab的目录
  const root = tempTreeData.find((res: any) => res.path === "kitab");
  return root?.sha;
}

export async function getRemainBackupKeys() {
  const result = await storage.snapshot("local", {
    excludeKeys: ["ico-"],
  });

  return Object.keys(result).filter((key) => isBackupKeyPrefix(key));
}

export async function loadGitRepoConf() {
  const gitInfo = await store.get(GIT_INFO_ATOM);
  if (!gitInfo.token) {
    return;
  }
  const localFileSha = await store.get(GIT_FILE_SHA_ATOM);

  // 先查看是否有主目录sha
  let rootSha = localFileSha["<ROOT>"];
  console.log("rootSha", rootSha);
  if (rootSha == null) {
    const latestRootSha = await findLatestRootSha(gitInfo);
    console.log("latestRootSha", latestRootSha);
    if (latestRootSha == null) {
      setTimeout(() => {
        notifications.show({
          color: "red",
          title: "数据同步失败",
          message: "请确保远程Git仓库中存在有效的kitab目录",
        });
      }, 5000);
      return;
    }
    rootSha = latestRootSha;
    localFileSha["<ROOT>"] = latestRootSha;
  }
  // 去查询
  const api = GIT_APIS[gitInfo.api];
  const url = `${api}/repos/${gitInfo.user}/${
    gitInfo.repo
  }/git/trees/${rootSha}?now=${Date.now()}`;
  const res = await fetch(url, header(gitInfo));
  const treeData = (await res.json())?.tree || [];

  const remainBackupKeys: string[] = [...(await getRemainBackupKeys())];

  if (treeData?.length > 0) {
    const list = treeData as any[];
    for (const result of list) {
      const filename = result.path;
      if (!isBackupKeyPrefix(filename)) {
        continue;
      }
      const index = remainBackupKeys.indexOf(filename);
      if (index !== -1) {
        remainBackupKeys.splice(index, 1);
      }

      const latestSha = result.sha;
      const localSha = localFileSha[filename];
      if (latestSha !== localSha) {
        // 使用服务器版本
        const res = await fetch(result.url, header(gitInfo));
        const data = await res.json();
        const content = base64Decode(data.content);
        storage.setItem(`local:${filename}`, JSON.parse(content));
        localFileSha[filename] = latestSha;
      }
    }
  }

  // 剩下的远程不存在文件，需要上传
  if (remainBackupKeys.length > 0) {
    await Promise.all(
      remainBackupKeys.map(async (filename) => {
        const value = await storage.getItem(`local:${filename}`);
        syncConfFile(gitInfo, filename, JSON.stringify(value));
      })
    );
  }
  store.set(GIT_FILE_SHA_ATOM, localFileSha);
}

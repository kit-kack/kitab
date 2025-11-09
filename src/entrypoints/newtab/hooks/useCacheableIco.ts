import { useMount } from "ahooks";
import { useAtom } from "jotai";
import { ICO_API_INDEX_ATOM } from "../store";

export interface IcoApi {
  value: string;
  url: string;
  default?: boolean;
  nonCacheable?: boolean;
  tip?: string;
}

export const DEFAULT_ICO_APIS: IcoApi[] = [
  {
    value: "xinac.net",
    url: "https://api.xinac.net/icon/?url=%u",
    default: true,
  },
  {
    value: "yandex.net",
    url: "https://favicon.yandex.net/favicon/%u",
    default: true,
    tip: " （啥都能搜🤫）",
  },
  {
    value: "uomg.com",
    url: "https://api.uomg.com/api/get.favicon?url=%u",
    default: true,
  },
  {
    value: "qqsuu.cn",
    url: "https://api.qqsuu.cn/api/dm-get?url=%u",
    default: true,
  },
  {
    value: "cccyun.cc",
    url: "http://favicon.cccyun.cc/%u",
    default: true,
  },
  {
    value: "google.com",
    url: "https://www.google.com/s2/favicons?domain=%u",
    nonCacheable: true,
    default: true,
    tip: " （有墙啊😫）",
  },
  {
    value: "iowen.cn",
    url: "https://api.iowen.cn/favicon/%u.png",
    default: true,
    nonCacheable: true,
  },
  {
    value: "cxr.cool",
    url: "https://api.cxr.cool/get.php?url=%u",
    default: true,
    nonCacheable: true,
  },
  {
    value: "15777.cn",
    url: "https://api.15777.cn/get.php?url=%u",
    default: true,
    nonCacheable: true,
  },
  {
    value: "ly522.com",
    url: "https://tools.ly522.com/ico/favicon.php?url=%u",
    default: true,
    nonCacheable: true,
  },
];

export interface UseCacheableIcoOptions {
  url: string;
  disableCache?: boolean;
}

export interface UseCacheableIcoResult {
  /**
   * 图标地址
   */
  icoUrl: string;
  /**
   * 是否加载完成
   */
  loaded: boolean;
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch (_) {
    return null;
  }
}

export function useCacheableIco(
  options: UseCacheableIcoOptions
): UseCacheableIcoResult {
  const [icoUrl, setIcoUrl] = useState<string>("");
  const [loaded, setLoaded] = useState<boolean>(false);
  const [icoApiIndex] = useAtom(ICO_API_INDEX_ATOM);

  useMount(async () => {
    const hostname = getHostname(options.url);
    if (!hostname) {
      return;
    }

    // 先使用本地缓存
    const cacheIcoUrl = await storage.getItem<string>(`local:ico-${hostname}`);
    if (cacheIcoUrl) {
      setIcoUrl(cacheIcoUrl);
      setLoaded(true);
      return;
    }

    // 否则就去请求api
    const icoApi = DEFAULT_ICO_APIS[icoApiIndex];
    const finalIcoUrl = icoApi.url.replace("%u", hostname);

    // 后续不走缓存
    if (icoApi.nonCacheable || options.disableCache) {
      setIcoUrl(finalIcoUrl);
      setLoaded(true);
      return;
    }

    // 远程请求
    const img = new Image();
    img.src = finalIcoUrl;
    img.crossOrigin = "*";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx && ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL();
        // 存入缓存
        storage.setItem(`local:ico-${hostname}`, base64);
        setIcoUrl(base64);
        setLoaded(true);
      } catch (_) {}
    };
  });

  return { icoUrl, loaded };
}

export function getDirectIcoUrl(
  url: string,
  icoApiIndex: number
): string | null {
  const hostname = getHostname(url);
  if (!hostname) {
    return null;
  }
  const icoApi = DEFAULT_ICO_APIS[icoApiIndex];
  return icoApi.url.replace("%u", hostname);
}



export function removeIcoCache(url: string) {
  const hostname = getHostname(url);
  if (!hostname) {
    return;
  }
  storage.removeItem(`local:ico-${hostname}`);
}
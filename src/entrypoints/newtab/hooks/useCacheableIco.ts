import { useMount } from "ahooks";
import { useAtom } from "jotai";
import { ICO_API_INDEX_ATOM } from "../store";
import { DEFAULT_ICO_APIS } from "../store/defaults";
import { isInternalUrl } from "@/utils/isInternalUrl";

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

function getHost(url: string) {
  try {
    return new URL(url).host;
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
    const host = getHost(options.url);
    if (!host) {
      return;
    }

    // 先使用本地缓存
    const cacheIcoUrl = await storage.getItem<string>(`local:ico-${host}`);
    if (cacheIcoUrl) {
      setIcoUrl(cacheIcoUrl);
      setLoaded(true);
      return;
    }

    // 判断是否为内网地址
    if (isInternalUrl(options.url)) {
      // 先本地创建记录，后续跳转时解析网站ico
      if ((await storage.getItem(`local:icofetch-${host}`)) === null) {
        storage.setItem(`local:icofetch-${host}`, Date.now());
      }
      return;
    }

    // 否则就去请求api
    const icoApi = DEFAULT_ICO_APIS[icoApiIndex];
    const finalIcoUrl = icoApi.url.replace("%u", host);

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
        storage.setItem(`local:ico-${host}`, base64);
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
  const host = getHost(url);
  if (!host) {
    return null;
  }
  const icoApi = DEFAULT_ICO_APIS[icoApiIndex];
  return icoApi.url.replace("%u", host);
}

export function removeIcoCache(url: string) {
  const host = getHost(url);
  if (!host) {
    return;
  }
  storage.removeItem(`local:ico-${host}`);
}

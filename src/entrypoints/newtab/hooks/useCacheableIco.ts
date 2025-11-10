import { useMount } from "ahooks";
import { useAtom } from "jotai";
import { ICO_API_INDEX_ATOM } from "../store";
import { DEFAULT_ICO_APIS } from "../store/defaults";


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
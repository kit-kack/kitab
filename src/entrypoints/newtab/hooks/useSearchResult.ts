import { useAtom } from "jotai";
import { SEARCH_FORECAST_INDEX_ATOM } from "../store";
import { useDebounceEffect } from "ahooks";
import JSON5 from "json5";

export interface SearchPredictionEngine {
  value: string;
  url: string;
  jsonp?: string;
  extract: (data: any) => string[];
}

export const DEFAULT_SEARCH_PREDICTION_ENGINES: SearchPredictionEngine[] = [
  {
    value: "Bing",
    url: "https://api.bing.com/qsonhs.aspx?q=%s", // JSONP : type=cb&
    extract: (data: any) =>
      data.AS.Results[0].Suggests.map((obj: any) => obj.Txt),
  },
  {
    value: "Baidu",
    url: "http://suggestion.baidu.com/su?wd=%s",
    jsonp: "baidu.sug",
    extract: (data: any) => data.s,
  },
  {
    value: "Google",
    url: "http://suggestqueries.google.com/complete/search?client=youtube&q=前端",
    jsonp: "google.ac.h",
    extract: (data: any) => data[1].map((arr: any) => arr[0]),
  },
  {
    value: "360", //&callback=window.so.sug
    url: "https://sug.so.360.cn/suggest?encodein=utf-8&encodeout=utf-8&format=json&word=%s",
    extract: (data: any) => data.result.map((obj: any) => obj.word),
  },
  {
    value: "Sogou",
    url: "https://sor.html5.qq.com/api/getsug?key=%s",
    jsonp: "sogou.sug",
    extract: (data: any) => data[1],
  },
  {
    value: "Taobao",
    url: "https://suggest.taobao.com/sug?code=utf-8&q=%s",
    extract: (data: any) => data.result.map((arr: any) => arr[0]),
  },
];

export async function requestSearchResult(url: string, returnAsJsonP: boolean) {
  // if (true) {
  //   const base = "一二三四五六七八九十";
  //   const result = [];
  //   const random = Math.floor(Math.random() * base.length);
  //   for (let i = 0; i < random; i++) {
  //     result.push(base);
  //   }
  //   return result;
  // }
  console.trace("proxy search", url, returnAsJsonP);
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type":
        returnAsJsonP != null
          ? "text/javascript; charset=utf-8"
          : "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });

  // 获取请求头的响应编码格式
  const contentType = res.headers.get("Content-Type") || "";
  // 获取charset=部分
  const charset =
    contentType
      .split(";")
      .find((part) => part.includes("charset="))
      ?.split("=")[1] || "utf-8";
  const arrayBuffer = await res.arrayBuffer();
  const text = new TextDecoder(charset).decode(arrayBuffer);
  if (returnAsJsonP) {
    return text;
  } else {
    return JSON5.parse(text);
  }
}

function convertJsonpTextToData(jsonpText: string, jsonpFuncName: string) {
  const index = jsonpText.indexOf(jsonpFuncName + "(");
  const lastBracketIndex = jsonpText.lastIndexOf(")");

  const params = `[${jsonpText.slice(
    index + jsonpFuncName.length + 1,
    lastBracketIndex
  )}]`;

  return JSON5.parse(params)[0];
}

export interface UseSearchResultOptions {
  search: string;
}

export type UseSearchResultReturn = {
  result: string[];
};

export function useSearchResult(
  options: UseSearchResultOptions
): UseSearchResultReturn {
  const [result, setResult] = useState<string[]>([]);
  const [searchForeCastApiIndex] = useAtom(SEARCH_FORECAST_INDEX_ATOM);

  // const service = useMemo(() => useSearchProxyService(), []);
  useDebounceEffect(() => {
    if (!options.search) {
      setResult([]);
      return;
    }

    const searchForeCastApi =
      DEFAULT_SEARCH_PREDICTION_ENGINES[searchForeCastApiIndex]!!;
    const finalUrl = searchForeCastApi.url.replace(
      "%s",
      encodeURIComponent(options.search)
    );

    requestSearchResult(finalUrl, searchForeCastApi.jsonp != null)
      .then((data) => {
        console.trace("now data", data);
        if (searchForeCastApi.jsonp) {
          data = convertJsonpTextToData(data, searchForeCastApi.jsonp);
        }
        setResult(searchForeCastApi.extract(data));
      })
      .catch(() => {
        setResult([]);
      });

    // service
    //   .search(finalUrl, searchForeCastApi.jsonp != null)
    //   .then((data) => {
    //     console.trace("now data", data);
    //     if (searchForeCastApi.jsonp) {
    //       data = convertJsonpTextToData(data, searchForeCastApi.jsonp);
    //     }
    //     setResult(searchForeCastApi.extract(data));
    //   })
    //   .catch(() => {
    //     setResult([]);
    //   });
  }, [options.search]);

  return { result };
}

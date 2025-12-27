import preset0 from "@/assets/background/preset-00.png?url";
import preset1 from "@/assets/background/preset-01.png?url";
import preset2 from "@/assets/background/preset-02.jpg?url";
import preset3 from "@/assets/background/preset-03.jpg?url";
import preset4 from "@/assets/background/preset-04.jpg?url";
import preset5 from "@/assets/background/preset-05.png?url";

export interface SearchEngine {
  value: string;
  url: string;
}

export const DEFAULT_SEARCH_ENGINES: SearchEngine[] = [
  {
    value: "Bing",
    url: "https://www.bing.com/search?q=%s",
  },
  {
    value: "Baidu",
    url: "https://www.baidu.com/s?wd=%s",
  },
  {
    value: "Google",
    url: "https://www.google.com/search?q=%s",
  },
  {
    value: "Github",
    url: "https://github.com/search?q=%s&ref=opensearch",
  },
];

export const DEFAULT_BG_PRESETS = [
  {
    title: "Bing今日壁纸",
    url: "https://at.oiik.cn/api/bingimg.x",
  },
  {
    title: "Bing随机壁纸",
    url: "https://at.oiik.cn/api/bingimg.x?random",
  },
  {
    title: "预设1",
    url: preset0,
  },
  {
    title: "预设2",
    url: preset5,
  },
  {
    title: "预设3",
    url: preset1,
  },
  {
    title: "预设4",
    url: preset2,
  },
  {
    title: "预设5",
    url: preset3,
  },
  {
    title: "预设6",
    url: preset4,
  },
];

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
  },
  {
    value: "favicon.im",
    url: "https://favicon.im/%u",
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

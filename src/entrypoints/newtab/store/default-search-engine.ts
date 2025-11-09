export interface SearchEngine {
  value: string;
  url: string;
}

export const DEFAULT_SEARCH_ENGINES : SearchEngine[] = [
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

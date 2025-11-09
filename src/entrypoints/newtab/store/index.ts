import { atom } from "jotai";
import { DEFAULT_SEARCH_ENGINES, SearchEngine } from "./default-search-engine";

/**
 * ico api index
 */
export const ICO_API_INDEX_ATOM = atom(
  async () => {
    return storage.getItem<number>("local:ico_api_index", {
      fallback: 0,
    });
  },
  (get, set, index: number) => {
    storage.setItem("local:ico_api_index", index);
  }
);

/**
 * search forecast  api index
 */
export const SEARCH_FORECAST_INDEX_ATOM = atom(
  async () => {
    return storage.getItem<number>("local:search_forecast_index", {
      fallback: 0,
    });
  },
  (get, set, index: number) => {
    storage.setItem("local:search_forecast_index", index);
  }
);

/**
 * default search engine list
 */
export const SEARCH_ENGINE_LIST_ATOM = atom(
  async () => {
    return storage.getItem<SearchEngine[]>("local:search_engine_list", {
      fallback: DEFAULT_SEARCH_ENGINES,
    });
  },
  (get, set, list: SearchEngine[]) => {
    console.log("write SEARCH_ENGINE_LIST_ATOM", list);
    storage.setItem("local:search_engine_list", list);
  }
);

export interface WebsiteBookmark {
  name: string;
  url: string;
}

export interface WebsiteBookmarkGroup {
  name: string;
  children: WebsiteBookmark[];
}

/**
 * website bookmark list
 */
export const WEBSITE_BOOKMARK_LIST_ATOM = atom(
  async () => {
    console.trace("read WEBSITE_BOOKMARK_LIST_ATOM");
    return storage.getItem<WebsiteBookmarkGroup[]>(
      "local:website_bookmark_list",
      {
        fallback: [],
      }
    );
  },
  (get, set, list: WebsiteBookmarkGroup[]) => {
    storage.setItem("local:website_bookmark_list", list);
  }
);

/**
 * input focus
 */
export const INPUT_FOCUS_ATOM = atom(false);


/**
 * add or edit bookmark
 */
export const BOOKMARK_EDITOR_ATOM = atom<[string, WebsiteBookmark] | null>(null);

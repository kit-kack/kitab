import { atom } from "jotai";
import { DEFAULT_SEARCH_ENGINES } from "./defaults";
import { useStorageAtom } from "@/utils/jotai";

/**
 * ico api index
 */
export const ICO_API_INDEX_ATOM = useStorageAtom("local:ico_api_index", 0);

/**
 * search forecast  api index
 */
export const SEARCH_FORECAST_INDEX_ATOM = useStorageAtom(
  "local:search_forecast_index",
  0
);

/**
 * default search engine list
 */
export const SEARCH_ENGINE_LIST_ATOM = useStorageAtom(
  "local:search_engine_list",
  DEFAULT_SEARCH_ENGINES
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
export const WEBSITE_BOOKMARK_LIST_ATOM = useStorageAtom<
  WebsiteBookmarkGroup[]
>("local:website_bookmark_list", []);

/**
 * input focus
 */
export const INPUT_FOCUS_ATOM = atom(false);

/**
 * add or edit bookmark
 */
export const BOOKMARK_EDITOR_ATOM = atom<[string, WebsiteBookmark] | null>(
  null
);

/**
 * bg-preset
 */
export const BG_PRESET_ATOM = useStorageAtom("local:bg_default", 0);

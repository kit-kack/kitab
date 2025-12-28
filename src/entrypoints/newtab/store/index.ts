import { atom } from "jotai";
import { DEFAULT_SEARCH_ENGINES } from "./defaults";
import { useStorageAtom } from "@/utils/jotai";
import { GitRepoStorage } from "@/utils/git-repo-action";

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

export const CURRENT_SCENE_ATOM = useStorageAtom<string>(
  "local:current_scene",
  "default"
);

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

export type BaseThemeVariant = "light" | "dark";
export type ThemeVariant = BaseThemeVariant | "system";

export interface Theme<T extends ThemeVariant> {
  main: T;
  search: T;
  bookmark: T;
  glass: boolean;
}

/**
 * theme
 */
export const THEME_ATOM = useStorageAtom<Theme<ThemeVariant>>("local:theme", {
  main: "system",
  search: "system",
  bookmark: "system",
  glass: false,
});

export const GIT_INFO_ATOM = useStorageAtom<GitRepoStorage>(
  "local:git_info_temp",
  {
    api: "Github",
    token: "",
    user: "",
    repo: "",
    branch: "",
    avatar: "",
  }
);

export const GIT_FILE_SHA_ATOM = useStorageAtom<Record<string, string>>(
  "local:git_file_sha_temp",
  {}
);

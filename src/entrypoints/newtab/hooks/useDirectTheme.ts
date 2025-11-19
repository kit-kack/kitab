import { useAtom } from "jotai";
import { BaseThemeVariant, Theme, THEME_ATOM } from "../store";

export function getSystemTheme(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useDirectTheme() : Theme<BaseThemeVariant> {
  const [theme] = useAtom(THEME_ATOM);
  return useMemo<Theme<BaseThemeVariant>>(() => {
    const systemTheme = getSystemTheme();
    return {
      main: theme.main === "system" ? systemTheme : theme.main,
      search: theme.search === "system" ? systemTheme : theme.search,
      bookmark: theme.bookmark === "system" ? systemTheme : theme.bookmark,
      glass: theme.glass,
    };
  }, [theme]);
}

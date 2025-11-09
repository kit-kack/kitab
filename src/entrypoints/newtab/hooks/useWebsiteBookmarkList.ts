import { useAtom } from "jotai";
import { WEBSITE_BOOKMARK_LIST_ATOM, WebsiteBookmarkGroup } from "../store";

export function useWebsiteBookmarkList(): [WebsiteBookmarkGroup[], (bookmarkGroupList: WebsiteBookmarkGroup[]) => void] {
  const [bookmarkGroupList, setBookmarkGroupList] = useAtom(
    WEBSITE_BOOKMARK_LIST_ATOM
  );
  // 需要兼容格式化
  let result = bookmarkGroupList;
  if (!Array.isArray(bookmarkGroupList)) {
    result = bookmarkGroupList ? Object.values(bookmarkGroupList) : [];
  }

  // 遍历result
  for (const group of result) {
    const children = group.children;
    if (!Array.isArray(children)) {
      group.children = children ? Object.values(children) : [];
    }
  }
  return [result, setBookmarkGroupList];
}

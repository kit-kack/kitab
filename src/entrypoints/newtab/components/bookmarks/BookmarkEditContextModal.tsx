import { useAtom } from "jotai";
import {
  BOOKMARK_EDITOR_ATOM,
  ICO_API_INDEX_ATOM,
  WebsiteBookmark,
} from "../../store";
import { Autocomplete, Button, Input } from "@mantine/core";
import { useWebsiteBookmarkList } from "../../hooks/useWebsiteBookmarkList";
import { ContextModalProps } from "@mantine/modals";
import { CacheableIco, DefaultIco } from "../CacheableIco";
import { getDirectIcoUrl } from "../../hooks/useCacheableIco";
import { useDebounceEffect } from "ahooks";
import { BookmarkOperate } from "./AllBookmarkHall";

export const BOOKMARK_EDIT_CONTEXT_MODAL_ID = "bookmark-edit-context";

export function BookmarkEditContextModal({
  context,
  id,
  innerProps: { group, index, bookmark, bookmarkOperate },
}: ContextModalProps<{
  group?: string;
  index?: number;
  bookmark?: WebsiteBookmark;
  bookmarkOperate?: BookmarkOperate;
}>) {
  const [localGroup, setLocalGroup] = useState(group || "");
  const [localBookmark, setLocalBookmark] = useState<WebsiteBookmark>(
    bookmark || { name: "", url: "" }
  );
  const bookmarkGroupNames = bookmarkOperate
    ? bookmarkOperate.getGroupList()
    : [];

  const [icoApiIndex] = useAtom(ICO_API_INDEX_ATOM);
  const [icoUrl, setIcoUrl] = useState<string | null>(
    getDirectIcoUrl(localBookmark.url, icoApiIndex)
  );

  useDebounceEffect(() => {
    setIcoUrl(getDirectIcoUrl(localBookmark.url, icoApiIndex));
  }, [localBookmark.url]);

  function saveBookmark() {
    bookmarkOperate &&
      bookmarkOperate.saveBookmark(group, index, localGroup, localBookmark);
    context.closeModal(id);
  }

  return (
    <form>
      <Input.Wrapper label="名称">
        <Input
          value={localBookmark.name}
          leftSection={
            icoUrl ? (
              <img width={16} src={icoUrl} onError={() => setIcoUrl(null)} />
            ) : (
              <DefaultIco />
            )
          }
          onChange={(e) =>
            setLocalBookmark({ ...localBookmark, name: e.target.value })
          }
        />
      </Input.Wrapper>
      <Input.Wrapper label="URL">
        <Input
          value={localBookmark.url}
          spellCheck={false}
          onChange={(e) =>
            setLocalBookmark({ ...localBookmark, url: e.target.value })
          }
        />
      </Input.Wrapper>
      <Autocomplete
        label="分组"
        placeholder="分组若不存在则会自动创建"
        value={localGroup}
        data={bookmarkGroupNames}
        onChange={(value) => setLocalGroup(value)}
      />

      <div className="flex justify-end mt-[10px] gap-[4px]">
        <Button
          size="xs"
          variant="subtle"
          onClick={() => context.closeModal(id)}
        >
          取消
        </Button>
        <Button size="xs" onClick={saveBookmark}>
          确认
        </Button>
      </div>
    </form>
  );
}

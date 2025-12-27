import { Button, Divider, Stack, Text } from "@mantine/core";
import { THEME_ATOM, WebsiteBookmark } from "../../store";
import { CacheableIco } from "../CacheableIco";
import { CSSProperties, MouseEventHandler } from "react";
import { SortableData, useSortable } from "@dnd-kit/sortable";
import { Active, useDndMonitor } from "@dnd-kit/core";
import { useContextMenu } from "mantine-contextmenu";
import {
  RiDeleteBinLine,
  RiEditLine,
  RiRefreshLine,
  RiShareBoxLine,
} from "@remixicon/react";
import { modals } from "@mantine/modals";
import { BOOKMARK_EDIT_CONTEXT_MODAL_ID } from "./BookmarkEditContextModal";
import { BookmarkOperate } from "./AllBookmarkHall";
import { showDangerModal } from "@/utils/modal";
import { removeIcoCache } from "../../hooks/useCacheableIco";
import { useAtom } from "jotai";
import { useDirectTheme } from "../../hooks/useDirectTheme";

export function PureBookmarkItem({ bookmark }: { bookmark: WebsiteBookmark }) {
  const theme = useDirectTheme();
  return (
    <Button
      variant="subtle"
      classNames={{
        root: `text-[16px] group mb-[16px] hover:backdrop-blur-[4px] transition-all duration-300 ${
          theme.bookmark === "light" ? "hover:bg-[#fff1]!" : null
        }`,
        label: "mr-auto",
      }}
      style={{
        "--button-justify": "flex-start",
        fontFamily: "Consolas",
      }}
      w={200}
      leftSection={<CacheableIco url={bookmark.url} />}
    >
      <Text truncate="end">{bookmark.name}</Text>
    </Button>
  );
}

export function getActiveSourceInfo(obj: Active): [string, number] | null {
  const data = obj.data.current!;
  if (!data) {
    return null;
  }
  const bookmark = data.bookmark as WebsiteBookmark;
  const sortable = data.sortable as SortableData["sortable"];
  if (!sortable || !bookmark) {
    return null;
  }
  const index = sortable.items.indexOf(bookmark.name);
  if (index === -1) {
    return null;
  }
  return [sortable.containerId as string, index];
}

export function BookmarkItem({
  bookmark,
  group,
  index,
  x,
  bookmarkOperate,
}: {
  bookmark: WebsiteBookmark;
  group: string;
  index: number;
  x: number;
  bookmarkOperate: BookmarkOperate;
}) {
  const id = `${group}-${index}-${bookmark.name}`;
  const [refreshKey, setRefreshKey] = useState(0);
  const theme = useDirectTheme();

  const { attributes, listeners, setNodeRef, transition, over, rect } =
    useSortable({
      id: id,
      data: {
        bookmark,
      },
    });
  const isOver = over !== null && over.id === id;
  const isLeft = isOver && x <= rect.current!.left + rect.current!.width / 2;
  useDndMonitor({
    onDragEnd: (event) => {
      if (!isOver || id === event.active.id) {
        return;
      }
      const activeSourceInfo = getActiveSourceInfo(event.active);
      if (!activeSourceInfo) {
        return;
      }
      const [sourceGroup, sourceIndex] = activeSourceInfo;
      const [targetGroup, targetIndex] = [group, index + (isLeft ? 0 : 1)];
      if (sourceGroup === targetGroup && sourceIndex === targetIndex) {
        return;
      }
      bookmarkOperate.moveBookmark(
        sourceGroup,
        sourceIndex,
        targetGroup,
        targetIndex
      );
    },
  });
  const { showContextMenu } = useContextMenu();

  const style: CSSProperties = {
    transition,
    background: isOver
      ? theme.bookmark === "light"
        ? "#fff2"
        : "rgba(0, 0, 0, 0.1)"
      : "transparent",
  };
  if (isOver) {
    if (isLeft) {
      style.borderLeft = "2px solid #1e90ff";
    } else {
      style.borderRight = "2px solid #1e90ff";
    }
  }

  const handleClickToRedirect: MouseEventHandler<HTMLButtonElement> = (e) => {
    document.location.href = bookmark.url;
  };

  const handleBookmarkContextMenu = showContextMenu((close) => {
    return (
      <Stack
        gap={4}
        classNames={{
          root: "p-[4px]",
        }}
      >
        <Button
          variant="subtle"
          justify="space-between"
          rightSection={<RiShareBoxLine size={16} />}
          size="xs"
          onClick={() => {
            window.open(bookmark.url, "_blank");
          }}
        >
          新标签页打开
        </Button>
        <Button
          variant="subtle"
          justify="space-between"
          rightSection={<RiRefreshLine size={16} />}
          size="xs"
          onClick={() => {
            removeIcoCache(bookmark.url);
            setRefreshKey(refreshKey + 1);
          }}
        >
          刷新图标缓存
        </Button>
        <Divider size="xs" />
        <Button
          variant="subtle"
          justify="space-between"
          rightSection={<RiEditLine size={16} />}
          size="xs"
          onClick={() => {
            modals.openContextModal({
              modal: BOOKMARK_EDIT_CONTEXT_MODAL_ID,
              title: "编辑书签",
              centered: true,
              innerProps: {
                group,
                index,
                bookmark,
                bookmarkOperate,
              },
            });
          }}
        >
          编辑
        </Button>
        <Button
          variant="subtle"
          justify="space-between"
          color="red"
          rightSection={<RiDeleteBinLine size={16} />}
          size="xs"
          onClick={() => {
            showDangerModal({
              children: (
                <span>
                  是否删除 [
                  <Text fw="bold" component="b">
                    {bookmark.name}
                  </Text>
                  ] 书签?
                </span>
              ),
              onConfirm() {
                bookmarkOperate.deleteBookmark(group, index);
              },
            });
          }}
        >
          删除
        </Button>
      </Stack>
    );
  });

  return (
    <Button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      variant="subtle"
      classNames={{
        root: `text-[16px] group mb-[16px] hover:backdrop-blur-[4px] transition-all duration-300 ${
          theme.bookmark === "light" ? "hover:bg-[#fff1]!" : "hover:bg-[#3331]!"
        }`,
        label: "mr-auto",
      }}
      style={{
        ...style,
        "--button-justify": "flex-start",
        fontFamily: "Consolas",
        "--text-color": theme.bookmark === "light" ? "#fff" : "#444",
      }}
      w={200}
      onContextMenu={handleBookmarkContextMenu}
      onClick={handleClickToRedirect}
      leftSection={<CacheableIco url={bookmark.url} key={refreshKey} />}
    >
      <Text truncate="end">{bookmark.name}</Text>
    </Button>
  );
}

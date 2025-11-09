import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { Button, Text } from "@mantine/core";
import { RiDragDropLine } from "@remixicon/react";
import { CSSProperties, useId } from "react";
import { getActiveSourceInfo } from "./BookmarkItem";
import { BookmarkOperate } from "./AllBookmarkHall";

export function EmptyPlaceholder({
  group,
  bookmarkOperate,
}: {
  group: string;
  bookmarkOperate: BookmarkOperate;
}) {
  const id = "empty-placeholder";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    over,
    rect,
  } = useSortable({
    id: id,
  });
  const isOver = over !== null && over.id === id;

  useDndMonitor({
    onDragEnd(event) {
      if (!isOver || id === event.active.id) {
        return;
      }
      const activeSourceInfo = getActiveSourceInfo(event.active);
      if (!activeSourceInfo) {
        return;
      }
      bookmarkOperate.moveBookmark(
        activeSourceInfo[0],
        activeSourceInfo[1],
        group,
        0
      );
    },
  });
  console.log("empty", isOver);
  const style: CSSProperties = {
    transition,
    // borderColor: isOver ? "#1e90ff" : void 0,
    background: isOver ? "rgba(0, 0, 0, 0.1)" : "transparent",
  };
  return (
    <Button
      variant={isOver ? "outline" : "light"}
      ref={setNodeRef}
      classNames={{
        root: "text-[16px] group mb-[16px] hover:backdrop-blur-[4px] transition-all duration-300",
        label: "mr-auto",
      }}
      style={{
        ...style,
        "--button-justify": "flex-start",
        fontFamily: "Consolas",
      }}
      w={200}
      leftSection={<RiDragDropLine size={16} />}
    >
      <Text truncate="end">移动至此分组</Text>
    </Button>
  );
}

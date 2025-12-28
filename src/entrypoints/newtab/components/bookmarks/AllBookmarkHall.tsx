import {
  WEBSITE_BOOKMARK_LIST_ATOM,
  WebsiteBookmark,
  WebsiteBookmarkGroup,
} from "../../store";
import { Button, Stack, Text } from "@mantine/core";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiBox2Line,
  RiDeleteBinLine,
  RiEditLine,
} from "@remixicon/react";
import { BookmarkItem, PureBookmarkItem } from "./BookmarkItem";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { EmptyPlaceholder } from "./EmptyPlaceholder";
import { useContextMenu } from "mantine-contextmenu";
import { modals } from "@mantine/modals";
import { showDangerModal } from "@/utils/modal";
import { BOOKMARK_GROUP_EDIT_CONTEXT_MODAL_ID } from "./BookmarkGroupEditContextModal";
import { useDirectTheme } from "../../hooks/useDirectTheme";
import { useAtom } from "jotai";

export interface AllBookmarkHallProps {
  applyParentBookmarkOperate: (
    bookmarkOperate: BookmarkOperate
  ) => BookmarkOperate;
}

export interface BookmarkOperate {
  moveBookmark: (
    sourceGroup: string,
    sourceIndex: number,
    targetGroup: string,
    targetIndex: number
  ) => void;

  deleteBookmark: (groupName: string, index: number) => void;

  saveBookmark: (
    oldGroup: string | undefined,
    oldIndex: number | undefined,
    newGroup: string,
    bookmark: WebsiteBookmark
  ) => void;

  renameBookmarkGroup: (sourceGroupName: string, newGroupName: string) => void;

  deleteGroup: (groupName: string) => void;

  getGroupList: () => string[];

  adjustGroupPos: (groupName: string, newIndex: number) => void;
}

export function AllBookmarkHall({
  applyParentBookmarkOperate,
}: AllBookmarkHallProps) {
  const [bookmarkGroupList, setBookmarkGroupList] = useAtom(
    WEBSITE_BOOKMARK_LIST_ATOM
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );
  const [sourceX, setSourceX] = useState<number>(0);
  const [x, setX] = useState<number>(0);
  const [currentDraggingBookmark, setCurrentDraggingBookmark] =
    useState<WebsiteBookmark | null>(null);
  const { showContextMenu } = useContextMenu();
  const theme = useDirectTheme();

  function handleDragStart(event: DragStartEvent) {
    const pointerEvent = event.activatorEvent as PointerEvent;
    setSourceX(pointerEvent.clientX || pointerEvent.x || 0);
    setCurrentDraggingBookmark(event.active.data.current!.bookmark);
  }

  function handleDragMove(event: DragMoveEvent) {
    setX(sourceX + event.delta.x);
  }
  function handleDragEnd(event: DragEndEvent) {
    setCurrentDraggingBookmark(null);
  }

  const bookmarkOperate = useMemo<BookmarkOperate>(
    () =>
      applyParentBookmarkOperate({
        moveBookmark(sourceGroup, sourceIndex, targetGroup, targetIndex) {
          const newBookmarkGroupList = [...bookmarkGroupList];
          const sourceGroupIndex = newBookmarkGroupList.findIndex(
            (group) => group.name === sourceGroup
          );
          const targetGroupIndex = newBookmarkGroupList.findIndex(
            (group) => group.name === targetGroup
          );
          if (sourceGroupIndex === -1 || targetGroupIndex === -1) {
            return;
          }
          const sourceGroupItem = newBookmarkGroupList[sourceGroupIndex];
          const targetGroupItem = newBookmarkGroupList[targetGroupIndex];
          const sourceBookmark = sourceGroupItem.children[sourceIndex];
          if (!sourceBookmark) {
            return;
          }
          sourceGroupItem.children.splice(sourceIndex, 1);
          targetGroupItem.children.splice(targetIndex, 0, sourceBookmark);
          setBookmarkGroupList(newBookmarkGroupList);
        },
        saveBookmark(oldGroup, oldIndex, newGroup, bookmark) {
          const finalNewGroup = newGroup.trim();
          const newBookmarkGroupList = [...bookmarkGroupList];
          if (oldGroup && oldIndex !== undefined) {
            const groupIndex = newBookmarkGroupList.findIndex(
              (group) => group.name === oldGroup
            );
            if (groupIndex !== -1) {
              const group = newBookmarkGroupList[groupIndex];
              if (finalNewGroup === oldGroup) {
                group.children[oldIndex] = bookmark;
                setBookmarkGroupList(newBookmarkGroupList);
                return;
              } else {
                group.children.splice(oldIndex, 1);
              }
            }
          }
          const groupIndex = newBookmarkGroupList.findIndex(
            (group) => group.name === finalNewGroup
          );
          const group =
            groupIndex > -1
              ? newBookmarkGroupList[groupIndex]
              : {
                  name: finalNewGroup,
                  children: [],
                };
          if (groupIndex === -1) {
            newBookmarkGroupList.push(group);
          }
          group.children.push(bookmark);
          console.log(newBookmarkGroupList);
          setBookmarkGroupList(newBookmarkGroupList);
        },
        deleteBookmark(groupName, index) {
          const newBookmarkGroupList = [...bookmarkGroupList];
          const groupIndex = newBookmarkGroupList.findIndex(
            (group) => group.name === groupName
          );
          if (groupIndex === -1) {
            return;
          }
          const groupItem = newBookmarkGroupList[groupIndex];
          if (!groupItem) {
            return;
          }
          groupItem.children.splice(index, 1);
          if (
            groupItem.children.length === 0 &&
            groupName.trim().length === 0
          ) {
            newBookmarkGroupList.splice(groupIndex, 1);
          }
          setBookmarkGroupList(newBookmarkGroupList);
        },
        renameBookmarkGroup(sourceGroupName, newGroupName) {
          const newBookmarkGroupList = bookmarkGroupList.map((item) => {
            if (item.name === sourceGroupName) {
              return {
                ...item,
                name: newGroupName,
              };
            }
            return item;
          });
          setBookmarkGroupList(newBookmarkGroupList);
        },

        deleteGroup(groupName) {
          const newBookmarkGroupList = bookmarkGroupList.filter(
            (item) => item.name !== groupName
          );
          setBookmarkGroupList(newBookmarkGroupList);
        },

        getGroupList() {
          return bookmarkGroupList.map((item) => item.name);
        },
        adjustGroupPos(groupName, newIndex) {
          const newBookmarkGroupList = [...bookmarkGroupList];
          const groupIndex = newBookmarkGroupList.findIndex(
            (group) => group.name === groupName
          );
          if (groupIndex === -1) {
            return;
          }
          newBookmarkGroupList.splice(
            newIndex,
            0,
            newBookmarkGroupList.splice(groupIndex, 1)[0]
          );
          setBookmarkGroupList(newBookmarkGroupList);
        },
      }),
    [bookmarkGroupList, setBookmarkGroupList]
  );

  const renderBookmarkItems = (group: WebsiteBookmarkGroup) => {
    if (group.children != null && group.children.length > 0) {
      return group.children.map((bookmark, index) => (
        <BookmarkItem
          bookmark={bookmark}
          key={bookmark.name}
          group={group.name}
          index={index}
          x={x}
          bookmarkOperate={bookmarkOperate}
        />
      ));
    }
    if (currentDraggingBookmark !== null) {
      return (
        <EmptyPlaceholder
          group={group.name}
          bookmarkOperate={bookmarkOperate}
        />
      );
    }
    return null;
  };

  const handleBookmarkGroupContextMenu = (
    group: WebsiteBookmarkGroup,
    index: number
  ) =>
    showContextMenu((close) => {
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
            rightSection={<RiEditLine size={16} />}
            size="xs"
            onClick={() => {
              modals.openContextModal({
                modal: BOOKMARK_GROUP_EDIT_CONTEXT_MODAL_ID,
                title: "重命名分组",
                centered: true,
                innerProps: {
                  group: group.name,
                  bookmarkOperate,
                },
              });
            }}
          >
            重命名分组
          </Button>
          {!(group.children?.length > 0) && (
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
                        {group.name}
                      </Text>
                      ] 分组?
                    </span>
                  ),
                  onConfirm() {
                    bookmarkOperate.deleteGroup(group.name);
                  },
                });
              }}
            >
              删除分组
            </Button>
          )}

          {index > 0 && (
            <Button
              variant="subtle"
              justify="space-between"
              rightSection={<RiArrowUpLine size={16} />}
              size="xs"
              onClick={() => {
                bookmarkOperate.adjustGroupPos(group.name, index - 1);
              }}
            >
              上移分组
            </Button>
          )}
          {index < bookmarkGroupList.length - 1 && (
            <Button
              variant="subtle"
              justify="space-between"
              rightSection={<RiArrowDownLine size={16} />}
              size="xs"
              onClick={() => {
                bookmarkOperate.adjustGroupPos(group.name, index + 1);
              }}
            >
              下移分组
            </Button>
          )}
        </Stack>
      );
    });

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        {bookmarkGroupList.map((group, index) => (
          <div
            key={group.name}
            className={`grid grid-cols-[200px_1fr] ${
              theme.bookmark === "light" ? "text-[#fff]" : "text-[#444]"
            }`}
          >
            <div className="pt-[12px] mr-[10px] text-[12px]   w-[200px] h-full">
              {group.name != null && group.name.trim().length > 0 ? (
                <h3
                  className="truncate  font-[400]  text-[12px] leading-none my-[0] hover:cursor-pointer"
                  onContextMenu={handleBookmarkGroupContextMenu(group, index)}
                >
                  {group.name}
                </h3>
              ) : (
                <div className="flex items-center gap-[4px]">
                  <RiBox2Line size={12} />
                  未命名分组
                </div>
              )}
            </div>
            <div className="max-w-[1020px] group ">
              <SortableContext
                items={
                  group.children != null && group.children.length > 0
                    ? group.children.map((bookmark) => bookmark.name)
                    : ["empty-placeholder"]
                }
                id={group.name}
              >
                {renderBookmarkItems(group)}
              </SortableContext>
            </div>
          </div>
        ))}
        <DragOverlay>
          {currentDraggingBookmark && (
            <PureBookmarkItem bookmark={currentDraggingBookmark} />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

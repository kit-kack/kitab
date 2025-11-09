import { useAtom } from "jotai";
import {
  WEBSITE_BOOKMARK_LIST_ATOM,
  WebsiteBookmark,
  WebsiteBookmarkGroup,
} from "../../store";
import { useWebsiteBookmarkList } from "../../hooks/useWebsiteBookmarkList";
import { Box, Button, Divider, Menu, Stack, Text } from "@mantine/core";
import { CacheableIco } from "../CacheableIco";
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiMenuLine,
  RiSettingsLine,
} from "@remixicon/react";
import { BookmarkItem, PureBookmarkItem } from "./BookmarkItem";
import {
  Active,
  closestCenter,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragPendingEvent,
  DragStartEvent,
  Over,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, SortableData } from "@dnd-kit/sortable";
import { EmptyPlaceholder } from "./EmptyPlaceholder";
import { useContextMenu } from "mantine-contextmenu";
import { modals } from "@mantine/modals";
import { showDangerModal } from "@/utils/modal";
import { BOOKMARK_GROUP_EDIT_CONTEXT_MODAL_ID } from "./BookmarkGroupEditContextModal";

export interface AllBookmarkHallProps {
  editMode?: boolean;
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
}

export function AllBookmarkHall({
  editMode,
  applyParentBookmarkOperate,
}: AllBookmarkHallProps) {
  const [bookmarkGroupList, setBookmarkGroupList] = useWebsiteBookmarkList();
  const [localBookmarkGroupList, setLocalBookmarkGroupList] =
    useState(bookmarkGroupList);
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
          const newBookmarkGroupList = [...localBookmarkGroupList];
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
          setLocalBookmarkGroupList(newBookmarkGroupList);
          setBookmarkGroupList(newBookmarkGroupList);
        },
        saveBookmark(oldGroup, oldIndex, newGroup, bookmark) {
          const newBookmarkGroupList = [...localBookmarkGroupList];
          if (oldGroup && oldIndex !== undefined) {
            const groupIndex = newBookmarkGroupList.findIndex(
              (group) => group.name === oldGroup
            );
            if (groupIndex !== -1) {
              const group = newBookmarkGroupList[groupIndex];
              if (newGroup === oldGroup) {
                group.children[oldIndex] = bookmark;
                setLocalBookmarkGroupList(newBookmarkGroupList);
                setBookmarkGroupList(newBookmarkGroupList);
                return;
              } else {
                group.children.splice(oldIndex, 1);
              }
            }
          }
          const groupIndex = newBookmarkGroupList.findIndex(
            (group) => group.name === newGroup
          );
          const group =
            groupIndex > -1
              ? newBookmarkGroupList[groupIndex]
              : {
                  name: newGroup,
                  children: [],
                };
          if (groupIndex === -1) {
            newBookmarkGroupList.push(group);
          }
          group.children.push(bookmark);
          console.log(newBookmarkGroupList);
          setLocalBookmarkGroupList(newBookmarkGroupList);
          setBookmarkGroupList(newBookmarkGroupList);
        },
        deleteBookmark(groupName, index) {
          const newBookmarkGroupList = [...localBookmarkGroupList];
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
          setLocalBookmarkGroupList(newBookmarkGroupList);
          setBookmarkGroupList(newBookmarkGroupList);
        },
        renameBookmarkGroup(sourceGroupName, newGroupName) {
          const newBookmarkGroupList = localBookmarkGroupList.map((item) => {
            if (item.name === sourceGroupName) {
              return {
                ...item,
                name: newGroupName,
              };
            }
            return item;
          });
          setLocalBookmarkGroupList(newBookmarkGroupList);
          setBookmarkGroupList(newBookmarkGroupList);
        },

        deleteGroup(groupName) {
          const newBookmarkGroupList = localBookmarkGroupList.filter(
            (item) => item.name !== groupName
          );
          setLocalBookmarkGroupList(newBookmarkGroupList);
          setBookmarkGroupList(newBookmarkGroupList);
        },

        getGroupList() {
          return localBookmarkGroupList.map((item) => item.name);
        },
      }),
    [
      localBookmarkGroupList,
      setLocalBookmarkGroupList,
      bookmarkGroupList,
      setBookmarkGroupList,
    ]
  );

  const renderBookmarkItems = (group: WebsiteBookmarkGroup) => {
    if (group.children.length > 0) {
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

  const handleBookmarkGroupContextMenu = (group: WebsiteBookmarkGroup) =>
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
          <Button
            variant="subtle"
            justify="space-between"
            color="red"
            rightSection={<RiDeleteBinLine size={16} />}
            size="xs"
            disabled={group.children?.length > 0}
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
        {localBookmarkGroupList.map((group) => (
          <div key={group.name} className="grid grid-cols-[200px_1fr]">
            <div
              className="pt-[12px] mr-[10px] text-[12px]   w-[200px] h-full"
              onContextMenu={handleBookmarkGroupContextMenu(group)}
            >
              {editMode ? (
                <div>{group.name}</div>
              ) : (
                <h3 className="truncate  font-[400]  text-[12px] leading-none my-[0]">
                  {group.name}
                </h3>
              )}
            </div>
            <div className="max-w-[1020px] group ">
              <SortableContext
                items={
                  group.children.length > 0
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

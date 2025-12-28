import { Button, Stack } from "@mantine/core";
import {
  AllBookmarkHall,
  BookmarkOperate,
} from "./components/bookmarks/AllBookmarkHall";
import { RiAddLine, RiSettingsLine, RiTornadoLine } from "@remixicon/react";
import { SearchCenter } from "./components/search/SearchCenter";
import styles from "./app.module.css";
import { useAtom } from "jotai";
import { BG_PRESET_ATOM, CURRENT_SCENE_ATOM, INPUT_FOCUS_ATOM } from "./store";
import { useRef, useState } from "react";
import { useMount } from "ahooks";
import { SettingHall } from "./components/settings/SettingHall";
import { useContextMenu } from "mantine-contextmenu";
import { BOOKMARK_EDIT_CONTEXT_MODAL_ID } from "./components/bookmarks/BookmarkEditContextModal";
import { modals } from "@mantine/modals";
import { DEFAULT_BG_PRESETS } from "./store/defaults";
import { SCENE_SWITCH_CONTEXT_MODAL_ID } from "./components/settings/components/SceneSwitchModal";

export function App() {
  const [focus] = useAtom(INPUT_FOCUS_ATOM);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchCenterHeight, setSearchCenterHeight] = useState(0);
  const { showContextMenu } = useContextMenu();
  const bookmarkOperateRef = useRef<BookmarkOperate>(null);
  const [bgPresetIndex] = useAtom(BG_PRESET_ATOM);
  const [currentScene] = useAtom(CURRENT_SCENE_ATOM);

  const applyParentBookmarkOperate = (bookmarkOperate: BookmarkOperate) => {
    bookmarkOperateRef.current = bookmarkOperate;
    return bookmarkOperate;
  };

  useMount(() => {
    setSearchCenterHeight(searchRef.current?.offsetHeight || 0);
    document.querySelector("#mask")!.classList.add("fade-in");
  });

  console.log("searchCenterHeight", searchCenterHeight);

  const contextMenuHandler = showContextMenu((close) => {
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
          rightSection={<RiAddLine size={16} />}
          size="xs"
          onClick={() => {
            modals.openContextModal({
              modal: BOOKMARK_EDIT_CONTEXT_MODAL_ID,
              title: "添加书签",
              centered: true,
              innerProps: {
                bookmarkOperate: bookmarkOperateRef.current,
              },
            });
          }}
        >
          添加书签
        </Button>
        <Button
          variant="subtle"
          justify="space-between"
          rightSection={<RiTornadoLine size={16} />}
          size="xs"
          onClick={() => {
            modals.openContextModal({
              modal: SCENE_SWITCH_CONTEXT_MODAL_ID,
              title: "切换场景",
              centered: true,
              innerProps: {
                originScene: currentScene,
              },
            });
          }}
        >
          切换场景
        </Button>
        <Button
          variant="subtle"
          justify="space-between"
          rightSection={<RiSettingsLine size={16} />}
          size="xs"
          onClick={() => {
            modals.open({
              centered: true,
              title: "设置",
              size: "xl",
              children: <SettingHall />,
            });
          }}
        >
          设置
        </Button>
      </Stack>
    );
  });

  return (
    <div className={styles.container} onContextMenu={contextMenuHandler}>
      <div className="-z-[100]">
        <img
          src={DEFAULT_BG_PRESETS[bgPresetIndex].url}
          className={`${styles["full-effect"]} ${styles.img} ${
            focus ? styles.focus : ""
          }`}
          alt=""
        />
        <div className={`${styles["full-effect"]} ${styles.mask}`}></div>
      </div>
      <div className="pt-[20vh] ">
        <div className="z-[500] mb-[10vh]" ref={searchRef}>
          <SearchCenter />
        </div>
        <div className={styles["bookmark-hall"]}>
          <AllBookmarkHall
            applyParentBookmarkOperate={applyParentBookmarkOperate}
          />
        </div>
      </div>
    </div>
  );
}

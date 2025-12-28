import "@/assets/shadcn-theme/style.css";
import "@mantine/core/styles.css";
import "@mantine/core/styles/baseline.css";
import "mantine-contextmenu/styles.css";
import "@mantine/notifications/styles.css";
import { shadcnCssVariableResolver } from "@/assets/shadcn-theme/cssVariableResolver.ts";
import { shadcnTheme } from "@/assets/shadcn-theme/theme.ts";
import { MantineProvider } from "@mantine/core";
import { ContextMenuProvider } from "mantine-contextmenu";
import { ModalsProvider } from "@mantine/modals";
import {
  BOOKMARK_EDIT_CONTEXT_MODAL_ID,
  BookmarkEditContextModal,
} from "./components/bookmarks/BookmarkEditContextModal";
import {
  BOOKMARK_GROUP_EDIT_CONTEXT_MODAL_ID,
  BookmarkGroupEditContextModal,
} from "./components/bookmarks/BookmarkGroupEditContextModal";
import { App } from "./App";
import { useDirectTheme } from "./hooks/useDirectTheme";
import {
  GIT_REPO_INFO_CONTEXT_MODAL_ID,
  GitRepoInfoFormModal,
} from "./components/settings/components/GitRepoInfoModal";
import { Notifications } from "@mantine/notifications";
import { SCENE_SWITCH_CONTEXT_MODAL_ID, SceneSwitchModal } from "./components/settings/components/SceneSwitchModal";

export function ThemeApp() {
  const theme = useDirectTheme();

  return (
    <MantineProvider
      theme={shadcnTheme}
      forceColorScheme={theme.main}
      cssVariablesResolver={shadcnCssVariableResolver}
    >
      <Notifications />
      <ModalsProvider
        modals={{
          [BOOKMARK_EDIT_CONTEXT_MODAL_ID]: BookmarkEditContextModal,
          [BOOKMARK_GROUP_EDIT_CONTEXT_MODAL_ID]: BookmarkGroupEditContextModal,
          [GIT_REPO_INFO_CONTEXT_MODAL_ID]: GitRepoInfoFormModal,
          [SCENE_SWITCH_CONTEXT_MODAL_ID]: SceneSwitchModal
        }}
      >
        <ContextMenuProvider>
          <App />
        </ContextMenuProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

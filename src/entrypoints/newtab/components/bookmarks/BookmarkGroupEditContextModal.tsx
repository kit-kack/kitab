import { Button, Input } from "@mantine/core";
import { useWebsiteBookmarkList } from "../../hooks/useWebsiteBookmarkList";
import { ContextModalProps } from "@mantine/modals";
import { BookmarkOperate } from "./AllBookmarkHall";

export const BOOKMARK_GROUP_EDIT_CONTEXT_MODAL_ID =
  "bookmark-group-edit-context";

export function BookmarkGroupEditContextModal({
  context,
  id,
  innerProps: { group, bookmarkOperate },
}: ContextModalProps<{
  group: string;
  bookmarkOperate: BookmarkOperate;
}>) {
  const [localGroup, setLocalGroup] = useState(group || "");

  function handleRenameBookmarkGroup() {
    if (group !== localGroup) {
      bookmarkOperate.renameBookmarkGroup(group, localGroup);
    }

    context.closeModal(id);
  }

  return (
    <form>
      <Input.Wrapper label="名称">
        <Input
          value={localGroup}
          onChange={(e) => setLocalGroup(e.target.value)}
        />
      </Input.Wrapper>

      <div className="flex justify-end mt-[10px] gap-[4px]">
        <Button
          size="xs"
          variant="subtle"
          onClick={() => context.closeModal(id)}
        >
          取消
        </Button>
        <Button size="xs" onClick={handleRenameBookmarkGroup}>
          确认
        </Button>
      </div>
    </form>
  );
}

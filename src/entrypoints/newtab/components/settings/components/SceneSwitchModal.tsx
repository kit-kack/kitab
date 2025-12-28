import {
  CURRENT_SCENE_ATOM,
} from "@/entrypoints/newtab/store";
import {
  Button,
  Autocomplete,
} from "@mantine/core";
import { useAsyncEffect } from "ahooks";
import { useAtom } from "jotai";
import { ContextModalProps } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

export const SCENE_SWITCH_CONTEXT_MODAL_ID = "scene-switch-context";

export function SceneSwitchModal({
  context,
  id,
  innerProps: { originScene },
}: ContextModalProps<{
  originScene: string;
}>) {
  const [scene, setScene] = useState<string>(originScene);
  const [sceneList, setSceneList] = useState<string[]>([]);
  const [currentScene, setCurrentScene] = useAtom(CURRENT_SCENE_ATOM);

  useAsyncEffect(async () => {
    const result = await storage.snapshot("local", {
      excludeKeys: ["ico-"],
    });
    const lookupKey = "website_bookmark_list_";
    const list = Object.keys(result)
      .filter((key) => key.startsWith(lookupKey))
      .map((key) => key.substring(lookupKey.length));
    setSceneList(list);
  }, []);

  function confirm() {
    if (!scene) {
      notifications.show({
        color: "red",
        message: "场景不能为空",
      });
      return;
    }
    setCurrentScene(scene);
    context.closeModal(id);
    location.reload();
  }

  return (
    <form className="text-[12px] p-[8px]">
      <Autocomplete
        data={sceneList || []}
        value={scene}
        onChange={(v) => setScene(v)}
        onOptionSubmit={(v) => setScene(v)}
      />

      <div className="w-full flex justify-end mt-[10px] gap-[4px]">
        <Button
          size="xs"
          variant="subtle"
          onClick={() => context.closeModal(id)}
        >
          取消
        </Button>
        <Button size="xs" onClick={confirm}>
          确认
        </Button>
      </div>
    </form>
  );
}

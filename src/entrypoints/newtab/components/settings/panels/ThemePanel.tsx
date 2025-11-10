import {
  Divider,
  SegmentedControl,
  Image,
  Grid,
  Center,
  ActionIcon,
  Button,
  UnstyledButton,
  Stack,
} from "@mantine/core";
import { Panel } from "../panel";
import { LabelFor } from "../components/LabelFor";
import { RiVerifiedBadgeFill, RiVerifiedBadgeLine } from "@remixicon/react";
import { DEFAULT_BG_PRESETS } from "@/entrypoints/newtab/store/defaults";
import { useAtom } from "jotai";
import { BG_PRESET_ATOM } from "@/entrypoints/newtab/store";

// wshMTODG5gIiRYS5KZR2GWMsHQq5YIaB0OLDAJBjZiDjLQgJGpa0OEOd

export function Component() {
  const [bgPresetIndex, setBgPresetIndex] = useAtom(BG_PRESET_ATOM);
  return (
    <form className="flex justify-between align-center flex-wrap justify-items-end gap-y-[8px] text-[12px]">
      <Divider className="w-full basis-[100%]" label="主题" />
      <LabelFor label="选项卡">
        <SegmentedControl
          data={["system", "dark", "light"]}
          size="xs"
          withItemsBorders={false}
        />
      </LabelFor>
      <LabelFor label="搜索框">
        <SegmentedControl
          data={["system", "dark", "light", "blur"]}
          size="xs"
          withItemsBorders={false}
        />
      </LabelFor>
      <LabelFor label="其他部分">
        <SegmentedControl
          data={["system", "dark", "light", "blur"]}
          size="xs"
          withItemsBorders={false}
        />
      </LabelFor>

      <Divider className="w-full basis-[100%]" label="壁纸" />
      <Grid columns={10}>
        {DEFAULT_BG_PRESETS.map((preset, index) => (
          <Grid.Col span={2}>
            <Stack justify="center" align="center" gap={4}>
              <Button
                variant="transparent"
                w="100%"
                h="100%"
                className="px-[0]!"
                style={{
                  "--mantine-spacing-xs": "0",
                }}
                rightSection={
                  index === bgPresetIndex && (
                    <RiVerifiedBadgeFill
                      size={16}
                      color="white"
                      className="absolute! right-[4px] bottom-[4px]"
                    />
                  )
                }
                onClick={() => setBgPresetIndex(index)}
              >
                <Image
                  radius="md"
                  src={preset.url}
                  fit="cover"
                  classNames={{
                    root: "transition-all",
                  }}
                />
              </Button>
              <div>{preset.title}</div>
            </Stack>
          </Grid.Col>
        ))}
      </Grid>
    </form>
  );
}

export const ThemePanel: Panel = {
  title: "主题",
  Component,
};

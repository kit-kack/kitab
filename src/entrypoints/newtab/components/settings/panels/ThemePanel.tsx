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
  Tooltip,
} from "@mantine/core";
import { Panel } from "../panel";
import { LabelFor } from "../components/LabelFor";
import {
  RiAppsLine,
  RiDropLine,
  RiGlassesLine,
  RiMoonFill,
  RiSunLine,
  RiVerifiedBadgeFill,
  RiVerifiedBadgeLine,
} from "@remixicon/react";
import { DEFAULT_BG_PRESETS } from "@/entrypoints/newtab/store/defaults";
import { useAtom } from "jotai";
import { BG_PRESET_ATOM } from "@/entrypoints/newtab/store";

// wshMTODG5gIiRYS5KZR2GWMsHQq5YIaB0OLDAJBjZiDjLQgJGpa0OEOd
const BASE_THEME_LIST = [
  {
    value: "system",
    label: (
      <Tooltip label="跟随系统" openDelay={500}>
        <RiAppsLine size={16} className="block" />
      </Tooltip>
    ),
  },
  {
    value: "light",
    label: (
      <Tooltip label="亮色" openDelay={500}>
        <RiSunLine size={16} className="block" />
      </Tooltip>
    ),
  },
  {
    value: "dark",
    label: (
      <Tooltip label="暗色" openDelay={500}>
        <RiMoonFill size={16} className="block" />
      </Tooltip>
    ),
  },
];

const EXT_THEME_LIST = [
  ...BASE_THEME_LIST,
  {
    value: "glass",
    label: (
      <Tooltip label="高斯模糊" openDelay={500}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          className="block"
          height="16"
          viewBox="0 0 408 416"
        >
          <path
            fill="currentColor"
            d="M74.5 229q8.5 0 15 6.5t6.5 15t-6.5 15t-15 6.5t-15-6.5t-6.5-15t6.5-15t15-6.5m0 86q8.5 0 15 6t6.5 15t-6.5 15t-15 6t-15-6t-6.5-15t6.5-15t15-6m0-171q8.5 0 15 6.5t6.5 15t-6.5 15t-15 6.5t-15-6.5t-6.5-15t6.5-15t15-6.5m-64 11Q21 155 21 165.5T10.5 176T0 165.5T10.5 155m64-96q8.5 0 15 6T96 80t-6.5 15t-15 6t-15-6T53 80t6.5-15t15-6m320 117q-10.5 0-10.5-10.5t10.5-10.5t10.5 10.5t-10.5 10.5m-149-75q-8.5 0-15-6T224 80t6.5-15t15-6t15 6t6.5 15t-6.5 15t-15 6m0-74Q235 27 235 16t10.5-11T256 16t-10.5 11m-235 213Q21 240 21 250.5T10.5 261T0 250.5T10.5 240M160 389q11 0 11 11t-11 11t-11-11t11-11m0-362q-11 0-11-11t11-11t11 11t-11 11m0 74q-9 0-15-6t-6-15t6-15t15-6t15 6t6 15t-6 15t-15 6m0 118q13 0 22.5 9t9.5 22.5t-9.5 23T160 283t-22.5-9.5t-9.5-23t9.5-22.5t22.5-9m170.5 10q8.5 0 15 6.5t6.5 15t-6.5 15t-15 6.5t-15-6.5t-6.5-15t6.5-15t15-6.5m0 86q8.5 0 15 6t6.5 15t-6.5 15t-15 6t-15-6t-6.5-15t6.5-15t15-6m0-171q8.5 0 15 6.5t6.5 15t-6.5 15t-15 6.5t-15-6.5t-6.5-15t6.5-15t15-6.5m0-85q8.5 0 15 6t6.5 15t-6.5 15t-15 6t-15-6t-6.5-15t6.5-15t15-6m64 181q10.5 0 10.5 10.5T394.5 261T384 250.5t10.5-10.5m-149 75q8.5 0 15 6t6.5 15t-6.5 15t-15 6t-15-6t-6.5-15t6.5-15t15-6m0 74q10.5 0 10.5 11t-10.5 11t-10.5-11t10.5-11M160 133q13 0 22.5 9.5t9.5 23t-9.5 22.5t-22.5 9t-22.5-9t-9.5-22.5t9.5-23T160 133m0 182q9 0 15 6t6 15t-6 15t-15 6t-15-6t-6-15t6-15t15-6m85.5-96q13.5 0 22.5 9t9 22.5t-9 23t-22.5 9.5t-23-9.5t-9.5-23t9.5-22.5t23-9m0-86q13.5 0 22.5 9.5t9 23t-9 22.5t-22.5 9t-23-9t-9.5-22.5t9.5-23t23-9.5"
          />
        </svg>
      </Tooltip>
    ),
  },
];

export function Component() {
  const [bgPresetIndex, setBgPresetIndex] = useAtom(BG_PRESET_ATOM);
  return (
    <form className="flex justify-between align-center flex-wrap justify-items-end gap-y-[8px] text-[12px]">
      <Divider className="w-full basis-[100%]" label="主题" />
      <LabelFor label="选项卡">
        <SegmentedControl
          data={BASE_THEME_LIST}
          size="xs"
          withItemsBorders={false}
        />
      </LabelFor>
      <LabelFor label="搜索框">
        <SegmentedControl
          data={EXT_THEME_LIST}
          size="xs"
          withItemsBorders={false}
        />
      </LabelFor>
      <LabelFor label="其他部分">
        <SegmentedControl
          data={EXT_THEME_LIST}
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

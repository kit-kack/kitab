import {
  Button,
  Divider,
  Grid,
  SegmentedControl,
  Stack,
  Tooltip,
  Image,
  Switch,
  FileButton,
} from "@mantine/core";
import { Panel } from "../panel";
import { LabelFor } from "../components/LabelFor";
import {
  RiAppsLine,
  RiMoonFill,
  RiSunLine,
  RiVerifiedBadgeFill,
} from "@remixicon/react";
import { DEFAULT_BG_PRESETS } from "@/entrypoints/newtab/store/defaults";
import { useAtom } from "jotai";
import {
  BaseThemeVariant,
  BG_PRESET_ATOM,
  THEME_ATOM,
} from "@/entrypoints/newtab/store";
import { importBackup } from "@/utils/backup";

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

function Component() {
  const [bgPresetIndex, setBgPresetIndex] = useAtom(BG_PRESET_ATOM);
  const [theme, setTheme] = useAtom(THEME_ATOM);
  return (
    <form className="flex justify-between align-center flex-wrap justify-items-end gap-y-[8px] text-[12px]">
      <LabelFor label="介绍">
        <span>欢迎使用 kitab</span>
      </LabelFor>
      <Divider
        className="w-full basis-[100%]"
        labelPosition="left"
        label="主题"
      />

      <LabelFor label="主体">
        <SegmentedControl
          data={BASE_THEME_LIST}
          size="xs"
          withItemsBorders={false}
          value={theme.main}
          onChange={(value) =>
            setTheme({ ...theme, main: value as BaseThemeVariant })
          }
        />
      </LabelFor>

      <LabelFor label="搜索框">
        <SegmentedControl
          data={BASE_THEME_LIST}
          size="xs"
          withItemsBorders={false}
          value={theme.search}
          onChange={(value) =>
            setTheme({ ...theme, search: value as BaseThemeVariant })
          }
        />
      </LabelFor>

      <LabelFor label="书签">
        <SegmentedControl
          data={BASE_THEME_LIST}
          size="xs"
          withItemsBorders={false}
          value={theme.bookmark}
          onChange={(value) =>
            setTheme({ ...theme, bookmark: value as BaseThemeVariant })
          }
        />
      </LabelFor>

      {/* <LabelFor label="高斯模糊">
        <Switch
          defaultChecked={theme.glass}
          onChange={(e) => setTheme({ ...theme, glass: e.target.checked })}
          classNames={{
            root: "inline-block",
          }}
        />
      </LabelFor> */}

      <Divider
        className="w-full basis-[100%]"
        labelPosition="left"
        label="壁纸"
      />
      <Grid columns={10}>
        {DEFAULT_BG_PRESETS.map((preset, index) => (
          <Grid.Col span={2} key={index}>
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
      <Divider
        className="w-full basis-[100%]"
        labelPosition="left"
        label="数据"
      />
      <div className="flex justify-start gap-[4px]">
        <Button variant="subtle" size="xs" onClick={exportBackup}>
          导出
        </Button>
        <FileButton accept=".zip" onChange={importBackup}>
          {(props) => (
            <Button variant="subtle" size="xs" {...props}>
              导入
            </Button>
          )}
        </FileButton>
      </div>
    </form>
  );
}

export const GeneralPanel: Panel = {
  title: "基本",
  Component,
};

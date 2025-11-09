import { Button, Divider, SegmentedControl } from "@mantine/core";
import { Panel } from "../panel";
import { LabelFor } from "../components/LabelFor";

function Component() {
  return (
    <form className="flex justify-between align-center flex-wrap justify-items-end gap-y-[8px] text-[12px]">
      <LabelFor label="介绍">
        <span>欢迎使用 kitab</span>
      </LabelFor>
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

      <Divider className="w-full basis-[100%]" label="数据" />
      <div className="flex justify-start gap-[4px]">
        <Button variant="subtle" color="red" size="xs">
          重置
        </Button>
        <Button variant="subtle" size="xs">
          导出
        </Button>
        <Button variant="subtle" size="xs">
          导入
        </Button>
      </div>
    </form>
  );
}

export const GeneralPanel: Panel = {
  title: "通用",
  Component,
};

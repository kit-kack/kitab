import { Tabs } from "@mantine/core";
import { GeneralPanel } from "./panels/GenerialPanel";
import { SearchPredictionPanel } from "./panels/SearchPrediction";
import { IconHelperPanel } from "./panels/IcoHelperPanel";
import { SearchEnginePanel } from "./panels/SearchEngine";
import { ThemePanel } from "./panels/ThemePanel";

const panels = [
  ThemePanel,
  GeneralPanel,
  SearchEnginePanel,
  SearchPredictionPanel,
  IconHelperPanel,
];

export function SettingHall() {
  return (
    <Tabs
      defaultValue={panels[0].title}
      orientation="vertical"
      classNames={{
        panel: "p-[8px]",
      }}
    >
      <Tabs.List>
        {panels.map((panel) => (
          <Tabs.Tab key={panel.title} value={panel.title}>
            {panel.title}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {panels.map((panel) => (
        <Tabs.Panel key={panel.title} value={panel.title}>
          <panel.Component />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

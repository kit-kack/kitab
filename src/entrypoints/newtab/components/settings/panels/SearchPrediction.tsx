import { CheckIcon, Radio, Table } from "@mantine/core";
import { Panel } from "../panel";
import { DEFAULT_SEARCH_PREDICTION_ENGINES } from "@/entrypoints/newtab/hooks/useSearchResult";
import { useAtom } from "jotai";
import { SEARCH_FORECAST_INDEX_ATOM } from "@/entrypoints/newtab/store";

function Component() {
  const [index, setIndex] = useAtom(SEARCH_FORECAST_INDEX_ATOM);
  const rows = DEFAULT_SEARCH_PREDICTION_ENGINES.map((engine, ind) => (
    <Table.Tr key={engine.value}>
      <Table.Td>{engine.value}</Table.Td>
      <Table.Td>{engine.url}</Table.Td>
      <Table.Td
        classNames={{
          td: "w-[50px]",
        }}
      >
        <Radio
          icon={CheckIcon}
          name="search-prediction-engine"
          value={engine.value}
          defaultChecked={index === ind}
          onChange={() => setIndex(ind)}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>名称</Table.Th>
          <Table.Th>URL</Table.Th>
          <Table.Th>默认</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

export const SearchPredictionPanel: Panel = {
  title: "搜索预测",
  Component,
};
